import path from 'node:path';

/** Markdown 장식은 제거하되 사람이 읽는 텍스트와 코드 식별자는 보존한다. */
export function normalizeInlineMarkdown(value) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFirstLearningGoal(content) {
  const lines = content.split(/\r?\n/);
  let inLearningGoals = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^##\s+학습 목표\s*$/.test(trimmed)) {
      inLearningGoals = true;
      continue;
    }
    if (inLearningGoals && /^##\s+/.test(trimmed)) break;
    if (inLearningGoals) {
      const bullet = trimmed.match(/^[-*]\s+(.+)$/);
      if (bullet) return normalizeInlineMarkdown(bullet[1]);
    }
  }

  return undefined;
}

function findParentReadmeTitle(doc, docsByPath) {
  let parentPath = path.posix.dirname(doc.path);

  while (parentPath && parentPath !== '.') {
    const readmePath = `${parentPath}/README.md`;
    const parentReadme = docsByPath.get(readmePath);
    if (parentReadme && parentReadme.path !== doc.path) return parentReadme.title;
    parentPath = path.posix.dirname(parentPath);
  }

  return undefined;
}

function assertUniqueField(docs, field) {
  const seen = new Map();
  for (const doc of docs) {
    const value = doc[field];
    if (!value) throw new Error(`문서 SEO ${field}이 비어 있습니다: ${doc.path}`);
    const existing = seen.get(value);
    if (existing) {
      throw new Error(`문서 SEO ${field}이 중복됩니다: ${existing} / ${doc.path}`);
    }
    seen.set(value, doc.path);
  }
}

/**
 * 문서 단일 원본에서 검색·공유용 필드를 파생한다.
 * 입력 배열은 `path`, `title`, `content`를 가져야 하며, 반환값은 입력 순서를 보존한다.
 */
export function deriveDocumentSeo(docs) {
  const docsByPath = new Map(docs.map((doc) => [doc.path, doc]));
  const titleCounts = new Map();
  for (const doc of docs) titleCounts.set(doc.title, (titleCounts.get(doc.title) ?? 0) + 1);

  const derived = docs.map((doc) => {
    const isDuplicateTitle = titleCounts.get(doc.title) > 1;
    const parentTitle = isDuplicateTitle ? findParentReadmeTitle(doc, docsByPath) : undefined;
    if (isDuplicateTitle && !parentTitle) {
      throw new Error(`중복 H1을 구분할 상위 README를 찾을 수 없습니다: ${doc.path}`);
    }

    const seoTitle = parentTitle ? `${doc.title} — ${parentTitle}` : doc.title;
    const learningGoal = extractFirstLearningGoal(doc.content);
    const description = learningGoal
      ? `${seoTitle}: ${learningGoal}`
      : `${seoTitle}에서 다루는 Next.js App Router 항목과 학습 순서를 정리한 한국어 가이드입니다.`;

    return { ...doc, seoTitle, description };
  });

  assertUniqueField(derived, 'seoTitle');
  assertUniqueField(derived, 'description');
  return derived;
}
