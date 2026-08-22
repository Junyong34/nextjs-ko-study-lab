import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(DOCS_ROOT, 'docs-manifest.json');

// 제외 대상 패턴 (ADR, 관리 파일, 에셋 등)
const EXCLUDED_PATTERNS = [
  /^docs(?:\/|$)/,
  /^assets(?:\/|$)/,
  /(?:^|\/)assets(?:\/|$)/,
  /^(?:AGENTS|CLAUDE|CONTEXT|PROGRESS|TRANSLATION|LICENSE).*\.md$/i,
  /\.system_generated/,
];

function isExcluded(relPath) {
  const normalized = relPath.split(path.sep).join('/');
  return EXCLUDED_PATTERNS.some((pattern) => pattern.test(normalized));
}

// 번호 접두사 제거 (예: 1-getting-started -> getting-started, 2.15-client-side-data-fetching -> client-side-data-fetching)
function cleanSegment(segment) {
  return segment.replace(/^\d+(\.\d+)*-/, '');
}

// 파일 상대 경로를 slug 및 URL로 변환
function pathToSlugAndUrl(relPath) {
  const normalized = relPath.split(path.sep).join('/');
  if (normalized === 'README.md') {
    return { url: '/', slug: [] };
  }

  const parts = normalized.split('/');
  const filename = parts.pop();
  const cleanedParts = parts.map(cleanSegment);

  if (filename === 'README.md') {
    const url = '/' + cleanedParts.join('/');
    return { url, slug: cleanedParts };
  }

  const baseName = filename.replace(/\.md$/, '');
  const cleanedFilename = cleanSegment(baseName);
  const fullSlug = [...cleanedParts, cleanedFilename];
  const url = '/' + fullSlug.join('/');

  return { url, slug: fullSlug };
}

// 첫 번째 # 제목 추출
function extractTitle(content, fallback) {
  const match = content.match(/^#\s+(.+)$/m);
  if (match && match[1]) {
    return match[1].trim();
  }
  return fallback;
}

// "예제 및 데모 설계" 섹션의 `- 데모 가능 여부: 가능/불가/검토 예정` 판정 라인 파싱
function extractDemoFeasibility(content) {
  const match = content.match(/^-\s*데모\s*가능\s*여부:\s*(가능|불가|검토\s*예정)/m);
  if (!match) return undefined;
  const value = match[1].replace(/\s+/g, '');
  if (value === '가능') return 'possible';
  if (value === '불가') return 'not-applicable';
  if (value === '검토예정') return 'pending';
  return undefined;
}

// ```demo 코드펜스 파싱
function extractDemos(content) {
  const demos = [];
  const demoRegex = /```demo[^\n]*\n([\s\S]*?)```/g;
  let match;
  while ((match = demoRegex.exec(content)) !== null) {
    const raw = match[1];
    const demoItem = {
      mode: 'inline',
      height: 360,
    };
    const lines = raw.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf(':');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (key === 'path') {
        demoItem.path = val;
      } else if (key === 'mode') {
        demoItem.mode = val;
      } else if (key === 'height') {
        const h = parseInt(val, 10);
        if (!Number.isNaN(h)) demoItem.height = h;
      } else if (key === 'caption') {
        demoItem.caption = val;
      }
    }
    if (demoItem.path) {
      demos.push(demoItem);
    }
  }
  return demos;
}

// 전체 디렉토리 재귀 탐색
function scanDirectory(dir, baseDir = DOCS_ROOT) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).split(path.sep).join('/');

    if (entry.isDirectory()) {
      if (!isExcluded(relPath)) {
        files = files.concat(scanDirectory(fullPath, baseDir));
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (!isExcluded(relPath)) {
        files.push(relPath);
      }
    }
  }

  return files;
}

// README.md의 학습 순서(목차) 파싱 헬퍼
function parseLearningOrderFromReadme(readmeRelPath, allDocsMap) {
  const fullPath = path.join(DOCS_ROOT, readmeRelPath);
  if (!fs.existsSync(fullPath)) return [];

  const content = fs.readFileSync(fullPath, 'utf-8');
  const readmeDir = path.dirname(readmeRelPath);
  const items = [];

  const lines = content.split('\n');
  let currentSection = '';
  let currentH3Order = '';
  let inNonOrderSection = false;

  const nonOrderSectionPattern = /^##\s+.*?(학습\s*목표|핵심\s*개념|문서\s*작성|설계\s*기록|문서\s*범위|예제\s*및|기준\s*출처|챕터\s*요약|학습\s*확인|연습\s*문제)/i;
  const orderSectionPattern = /^##\s+.*?(학습|목차|카테고리|커리큘럼|흐름|분류|가이드)/i;

  for (const line of lines) {
    const trimmed = line.trim();

    // H2 헤더 감지
    if (trimmed.startsWith('## ')) {
      if (nonOrderSectionPattern.test(trimmed)) {
        inNonOrderSection = true;
      } else {
        inNonOrderSection = false;
      }
      currentSection = '';
      currentH3Order = '';
      continue;
    }

    if (inNonOrderSection) continue;

    // H3 섹션 (소분류 or 번호가 붙은 서브카테고리)
    const h3Match = trimmed.match(/^###\s+(?:(\d+(?:\.\d+)*)\s+)?(.+)$/);
    if (h3Match) {
      currentH3Order = h3Match[1] || '';
      currentSection = h3Match[2].trim();
      continue;
    }

    // 불릿 링크 매칭: e.g. - 2.61 [AI Coding Agents](./ai-agents.md) or - 1.1 [Installation](./installation.md)
    const bulletMatch = trimmed.match(/^(?:-\s+|\d+\.\s+)(?:(\d+(?:\.\d+)*)\s+)?\[([^\]]+)\]\(([^)]+)\)/);
    if (bulletMatch) {
      const explicitOrder = bulletMatch[1] || '';
      const order = explicitOrder || currentH3Order || '';
      const linkTitle = bulletMatch[2].trim();
      const rawTarget = bulletMatch[3].trim();

      // 상대 링크 정규화
      const targetRelPath = path.posix.normalize(path.posix.join(readmeDir === '.' ? '' : readmeDir, rawTarget));
      
      items.push({
        order,
        linkTitle,
        targetRelPath,
        section: currentSection || undefined,
      });
    }
  }

  return items;
}

// 카테고리 트리 빌드
function buildCategoryTree(allDocsMap) {
  // 최상위 카테고리 폴더 목록 탐색 (1-getting-started, 2-guides, 3-api-reference, 4-glossary, 5-architecture)
  const rootEntries = fs.readdirSync(DOCS_ROOT, { withFileTypes: true });
  const categoryDirs = rootEntries
    .filter((e) => e.isDirectory() && /^\d+-/.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => {
      const numA = parseInt(a.split('-')[0], 10);
      const numB = parseInt(b.split('-')[0], 10);
      return numA - numB;
    });

  const tree = [];

  // 루트 README (홈)
  if (allDocsMap.has('README.md')) {
    const rootDoc = allDocsMap.get('README.md');
    tree.push({
      title: rootDoc.title,
      url: rootDoc.url,
      path: rootDoc.path,
      order: '0',
    });
  }

  function processCategory(catDir) {
    const readmeRel = `${catDir}/README.md`;
    const readmeDoc = allDocsMap.get(readmeRel);
    const catTitle = readmeDoc ? readmeDoc.title : cleanSegment(catDir);
    const catUrl = readmeDoc ? readmeDoc.url : '/' + cleanSegment(catDir);

    const dirBase = path.basename(catDir);
    const dirOrderMatch = dirBase.match(/^(\d+(?:\.\d+)*)-/);
    const autoOrder = dirOrderMatch ? dirOrderMatch[1] : undefined;

    const node = {
      title: catTitle,
      url: catUrl,
      path: readmeRel,
      order: autoOrder,
      children: [],
    };

    const orderedItems = parseLearningOrderFromReadme(readmeRel, allDocsMap);
    const processedPaths = new Set([readmeRel]);

    for (const item of orderedItems) {
      const targetDoc = allDocsMap.get(item.targetRelPath);
      if (!targetDoc) continue;

      processedPaths.add(item.targetRelPath);

      // 하위 README인 경우 (하위 카테고리 / 서브그룹)
      if (item.targetRelPath.endsWith('/README.md')) {
        const subCatDir = path.dirname(item.targetRelPath);
        const subNode = processCategory(subCatDir);
        if (item.order) subNode.order = item.order;
        if (item.section) subNode.section = item.section;
        node.children.push(subNode);
      } else {
        node.children.push({
          title: targetDoc.title || item.linkTitle,
          url: targetDoc.url,
          path: targetDoc.path,
          order: item.order || undefined,
          section: item.section || undefined,
          demos: targetDoc.demos,
          demoFeasibility: targetDoc.demoFeasibility,
        });
      }
    }

    // README에 명시되지 않았으나 해당 디렉토리 아래에 존재하는 파일 추가 (누락 방지)
    for (const [docPath, doc] of allDocsMap.entries()) {
      if (docPath.startsWith(catDir + '/') && !processedPaths.has(docPath)) {
        const relToCat = path.posix.relative(catDir, docPath);
        if (!relToCat.includes('/') || docPath.endsWith('/README.md')) {
          processedPaths.add(docPath);
          if (docPath.endsWith('/README.md')) {
            const subDir = path.dirname(docPath);
            node.children.push(processCategory(subDir));
          } else {
            const fileBase = path.basename(docPath);
            const fileOrderMatch = fileBase.match(/^(\d+(?:\.\d+)*)-/);
            node.children.push({
              title: doc.title,
              url: doc.url,
              path: doc.path,
              order: fileOrderMatch ? fileOrderMatch[1] : undefined,
              demos: doc.demos,
              demoFeasibility: doc.demoFeasibility,
            });
          }
        }
      }
    }

    return node;
  }

  for (const catDir of categoryDirs) {
    tree.push(processCategory(catDir));
  }

  return tree;
}

function buildManifest() {
  console.log('🔍 Scanning markdown files in nextjs-docs...');
  const mdFiles = scanDirectory(DOCS_ROOT);
  console.log(`📄 Found ${mdFiles.length} markdown documents.`);

  const docs = [];
  const urlMap = {};
  const allDocsMap = new Map();

  for (const relPath of mdFiles) {
    const fullPath = path.join(DOCS_ROOT, relPath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const { url, slug } = pathToSlugAndUrl(relPath);
    const fallbackTitle = path.basename(relPath, '.md');
    const title = extractTitle(content, fallbackTitle);
    const demos = extractDemos(content);
    const demoFeasibility = extractDemoFeasibility(content);

    const docEntry = {
      path: relPath,
      url,
      slug,
      title,
      demos,
      demoFeasibility,
    };

    docs.push(docEntry);
    allDocsMap.set(relPath, docEntry);

    if (urlMap[url]) {
      console.warn(`⚠️ Warning: Duplicate URL detected: "${url}" for paths: "${urlMap[url].path}" and "${relPath}"`);
    }
    urlMap[url] = docEntry;
  }

  // URL 알파벳/계층 순서로 정렬
  docs.sort((a, b) => a.path.localeCompare(b.path));

  // 목차 카테고리 트리 생성
  const tree = buildCategoryTree(allDocsMap);

  const manifest = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    generatedAt: new Date().toISOString(),
    totalDocs: docs.length,
    docs,
    urlMap,
    tree,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`✅ Manifest generated successfully: ${OUTPUT_FILE}`);
  console.log(`📊 Total Documents: ${manifest.totalDocs}`);
  console.log(`🌐 Total Unique URLs: ${Object.keys(urlMap).length}`);
  
  const totalDemos = docs.reduce((acc, d) => acc + d.demos.length, 0);
  console.log(`🧩 Total Embedded Demos: ${totalDemos}`);

  return manifest;
}

buildManifest();
