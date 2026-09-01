import { codeToHtml } from 'shiki'

/**
 * 코드펜스의 언어 표기를 shiki가 아는 이름으로 맞춥니다.
 */
export const LANG_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  html: 'html',
  css: 'css',
  json: 'json',
  sh: 'bash',
  bash: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  markdown: 'markdown',
  sql: 'sql',
  env: 'dotenv',
}

export const HIGHLIGHT_THEME = 'github-dark'

/** 하이라이팅 결과 메모리 캐시. 같은 코드가 여러 문서에 나오는 경우가 흔하다. */
const highlightCache = new Map<string, string>()

export function normalizeLang(language: string): string {
  return LANG_MAP[language.toLowerCase()] || language.toLowerCase() || 'text'
}

export function cacheKeyFor(lang: string, code: string): string {
  return `${lang}:${code}`
}

export function getCached(key: string): string | undefined {
  return highlightCache.get(key)
}

/**
 * 코드를 하이라이팅해 HTML을 돌려줍니다. 모르는 언어면 text로 물러섭니다.
 *
 * 이 호출은 지금 **런타임(브라우저)** 에서 일어납니다.
 * 빌드 타임(`@shikijs/rehype`)으로 옮기는 것은 [01. 7-3](../../../docs/01-ui-and-screen-design.md)의
 * 방향이며 별도 티켓입니다.
 */
export async function highlight(code: string, language: string): Promise<string> {
  const lang = normalizeLang(language)
  const key = cacheKeyFor(lang, code)

  const cached = highlightCache.get(key)
  if (cached) return cached

  try {
    const html = await codeToHtml(code, { lang, theme: HIGHLIGHT_THEME })
    highlightCache.set(key, html)
    return html
  } catch {
    const fallback = await codeToHtml(code, { lang: 'text', theme: HIGHLIGHT_THEME })
    highlightCache.set(key, fallback)
    return fallback
  }
}
