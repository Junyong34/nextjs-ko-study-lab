import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const packageRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(packageRoot, '../../..')
const docsRoot = path.join(repoRoot, 'nextjs-docs')
const yamlPath = path.join(packageRoot, 'demos.yaml')

const ZONE_APP_DIR_MAP = {
  baseline: 'apps/demo-baseline',
  cache: 'apps/demo-cache-components',
  prefetch: 'apps/demo-prefetch',
  export: 'apps/demo-export',
  proxy: 'apps/demo-proxy',
}

const DemoZoneSchema = z.enum(['baseline', 'cache', 'prefetch', 'export', 'proxy'])
const DemoStatusSchema = z.enum(['stub', 'wip', 'done'])

const DemoSchema = z.object({
  url: z.string().min(1, 'url은 비어있을 수 없습니다'),
  title: z.string().min(1, 'title은 비어있을 수 없습니다'),
  doc: z.string().min(1, 'doc은 비어있을 수 없습니다'),
  zone: DemoZoneSchema,
  status: DemoStatusSchema,
})

const DemosListSchema = z.array(DemoSchema)

function getAllFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx', '.md']) {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, exts))
    } else if (exts.includes(path.extname(entry.name))) {
      files.push(fullPath)
    }
  }
  return files
}

function normalizeDocPath(p) {
  return p
    .replace(/^\/?(nextjs-docs\/)?/, '')
    .replace(/(^|\/)(\d+(\.\d+)*-)/g, '$1')
}

function resolveDocFile(docPath) {
  // 1. 직접 경로 존재 확인
  const directPath = path.join(docsRoot, docPath)
  if (fs.existsSync(directPath)) {
    return directPath
  }

  // 2. 숫자 접두사 정규화 매칭 탐색
  const allDocFiles = getAllFiles(docsRoot, ['.md'])
  const normalizedTarget = normalizeDocPath(docPath)

  for (const file of allDocFiles) {
    const rel = path.relative(docsRoot, file)
    if (normalizeDocPath(rel) === normalizedTarget) {
      return file
    }
  }

  // 3. 파일명만 일치하는 파일 탐색
  const targetBase = path.basename(docPath)
  for (const file of allDocFiles) {
    if (path.basename(file) === targetBase) {
      return file
    }
  }

  return null
}

function checkCacheTagPrefixes(demo, demoDir, errors, warnings) {
  if (!fs.existsSync(demoDir)) return

  const codeFiles = getAllFiles(demoDir, ['.ts', '.tsx', '.js', '.jsx'])
  const expectedPrefix = `${demo.url.replace(/\//g, '-')}:`
  const tagRegex = /(?:cacheTag|revalidateTag)\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g

  for (const file of codeFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    let match
    while ((match = tagRegex.exec(content)) !== null) {
      const tagValue = match[1]
      if (!tagValue.startsWith(expectedPrefix)) {
        warnings.push(
          `[캐시 태그 규칙] ${path.relative(repoRoot, file)}: 태그 '${tagValue}'는 데모 접두사 '${expectedPrefix}'로 시작해야 합니다. (03. 결합 구조 §6-6)`,
        )
      }
    }
  }
}

function checkMarkdownDemoCodeblocks(demos, errors, warnings) {
  const allDocFiles = getAllFiles(docsRoot, ['.md'])
  const knownUrls = new Set(demos.map((d) => d.url))
  const demoBlockRegex = /```demo\s*\n([\s\S]*?)```/g

  for (const file of allDocFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    let match
    while ((match = demoBlockRegex.exec(content)) !== null) {
      const blockContent = match[1]
      const pathMatch = blockContent.match(/^path:\s*(.+)$/m)
      if (pathMatch) {
        const demoPath = pathMatch[1].trim()
        if (!knownUrls.has(demoPath)) {
          warnings.push(
            `[문서 코드펜스] ${path.relative(repoRoot, file)}: 코드펜스 path '${demoPath}'가 demos.yaml에 정의되어 있지 않습니다.`,
          )
        }
      }
    }
  }
}

function runLint() {
  console.log(`[demos:lint] 검사 시작: ${yamlPath}`)

  const errors = []
  const warnings = []

  if (!fs.existsSync(yamlPath)) {
    console.error(`[demos:lint] 오류: demos.yaml을 찾을 수 없습니다: ${yamlPath}`)
    process.exit(1)
  }

  const rawYaml = fs.readFileSync(yamlPath, 'utf-8')
  let parsedRaw
  try {
    parsedRaw = yaml.load(rawYaml)
  } catch (err) {
    console.error(`[demos:lint] YAML 파싱 실패:`, err.message)
    process.exit(1)
  }

  const parseResult = DemosListSchema.safeParse(parsedRaw)
  if (!parseResult.success) {
    console.error(`[demos:lint] 스키마 검증 실패:`)
    console.error(JSON.stringify(parseResult.error.format(), null, 2))
    process.exit(1)
  }

  const demos = parseResult.data

  // 1. URL 전역 유일성 검사
  const seenUrls = new Map()
  for (const demo of demos) {
    if (seenUrls.has(demo.url)) {
      errors.push(
        `[URL 중복] url '${demo.url}'가 중복 선언되었습니다. (최초: ${seenUrls.get(demo.url).title}, 중복: ${demo.title})`,
      )
    } else {
      seenUrls.set(demo.url, demo)
    }
  }

  // 2. doc 파일 존재 검사
  for (const demo of demos) {
    const resolvedDoc = resolveDocFile(demo.doc)
    if (!resolvedDoc) {
      errors.push(
        `[문서 부재] 데모 '${demo.url}'의 doc '${demo.doc}' 파일이 nextjs-docs/에 존재하지 않습니다.`,
      )
    }
  }

  // 3. status: done 인 데모에 대해 해당 zone의 실제 진입점 page.tsx 존재 검사
  for (const demo of demos) {
    const appDir = ZONE_APP_DIR_MAP[demo.zone]
    if (!appDir) {
      errors.push(`[알 수 없는 zone] 데모 '${demo.url}'의 zone '${demo.zone}'이 유효하지 않습니다.`)
      continue
    }

    const demoRouteDir = path.join(
      repoRoot,
      'nextjs-app',
      appDir,
      'src/app/zone',
      demo.zone,
      demo.url,
    )
    const entryPageFile = path.join(demoRouteDir, 'page.tsx')

    if (demo.status === 'done') {
      if (!fs.existsSync(entryPageFile)) {
        errors.push(
          `[진입점 부재] 'status: done'인 데모 '${demo.url}'의 진입점 파일이 없습니다: ${path.relative(repoRoot, entryPageFile)}`,
        )
      }
    } else if (demo.status === 'wip') {
      if (!fs.existsSync(entryPageFile)) {
        warnings.push(
          `[진입점 미작성] 'status: wip'인 데모 '${demo.url}'의 진입점 파일이 아직 없습니다: ${path.relative(repoRoot, entryPageFile)}`,
        )
      }
    }

    // 4. 캐시 태그 접두사 검사 기초
    checkCacheTagPrefixes(demo, demoRouteDir, errors, warnings)
  }

  // 5. 문서 내 demo 코드펜스 대조 검사
  checkMarkdownDemoCodeblocks(demos, errors, warnings)

  // 결과 출력
  console.log(`----------------------------------------`)
  console.log(`검사 완료: 총 ${demos.length}개 데모`)

  if (warnings.length > 0) {
    console.log(`\n⚠️  경고 (${warnings.length}건):`)
    for (const w of warnings) {
      console.log(` - ${w}`)
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌ 오류 (${errors.length}건):`)
    for (const e of errors) {
      console.error(` - ${e}`)
    }
    console.log(`----------------------------------------`)
    process.exit(1)
  }

  console.log(`\n✅ 모든 린트 검사를 통과했습니다.`)
  console.log(`----------------------------------------`)
}

runLint()
