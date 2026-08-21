export interface SlugResult {
  primary: string
  /** "Caching (캐싱)"처럼 괄호가 붙은 제목에서 영문 부분만 뽑은 보조 id */
  alias?: string
}

/**
 * 마크다운 헤딩 텍스트를 HTML id로 바꿉니다.
 *
 * 이 함수가 `MarkdownRenderer.tsx` 안에 있던 탓에 `TableOfContents`가
 * 861줄짜리 클라이언트 모듈 전체를 끌어오고 있었습니다. 여기로 옮기면서 그 의존이 끊깁니다.
 */
export function slugify(text: string): SlugResult {
  const clean = text
    .replace(/<[^>]*>/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()

  const primary = clean
    .toLowerCase()
    .replace(/["'“”‘’]/g, '')
    // 한글 음절(AC00-D7A3) · 자모(1100-11FF) · 호환 자모(3130-318F)는 남긴다.
    // 코드포인트 표기를 그대로 유지한다 — 문자로 풀어 쓰면 범위 끝이 미할당이라 어긋난다.
    .replace(/[^\w\s\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  let alias: string | undefined
  const parenMatch = clean.match(/^([^(]+)\s*\(([^)]+)\)$/)
  if (parenMatch) {
    const englishPart = parenMatch[1].trim()
    const aliasCandidate = englishPart
      .toLowerCase()
      .replace(/["'“”‘’]/g, '')
      .replace(/[^\w\s-]/g, ' ')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    if (aliasCandidate && aliasCandidate !== primary) {
      alias = aliasCandidate
    }
  }

  return { primary, alias }
}

/** 헤딩 텍스트에서 마크다운 표기를 걷어낸 순수 텍스트. 목차 라벨에 쓴다. */
export function stripInlineMarkup(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim()
}
