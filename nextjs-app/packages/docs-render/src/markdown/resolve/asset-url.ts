/**
 * 마크다운의 상대 이미지 경로(`./assets/x.webp`)를 셸의 스트리밍 라우트로 바꿉니다.
 *
 * `nextjs-docs/*​/assets/*.webp`는 상대 경로만으로는 브라우저에 그려지지 않습니다.
 * 셸의 `/docs-assets/[...path]` 라우트 핸들러가 대신 흘려보냅니다.
 */
export function resolveAssetUrl(src: string, docPath?: string): string {
  if (!src) return ''
  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('/docs-assets/')
  ) {
    return src
  }

  const cleanSrc = src.replace(/^\.\//, '')
  if (!docPath) {
    return `/docs-assets/${cleanSrc}`
  }

  // docPath가 "1-getting-started/caching.md"면 디렉토리 "1-getting-started"를 앞에 붙인다
  const lastSlashIdx = docPath.lastIndexOf('/')
  const docDir = lastSlashIdx !== -1 ? docPath.slice(0, lastSlashIdx) : ''

  if (docDir) {
    return `/docs-assets/${docDir}/${cleanSrc}`
  }
  return `/docs-assets/${cleanSrc}`
}
