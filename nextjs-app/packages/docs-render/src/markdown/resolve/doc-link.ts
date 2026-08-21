/** 파일·디렉토리 이름 앞의 정렬용 번호(`2.14-`)를 떼어냅니다. */
export function cleanSegment(segment: string): string {
  return segment.replace(/^\d+(\.\d+)*-/, '')
}

/**
 * 마크다운의 상대 문서 링크를 사이트 URL로 바꿉니다.
 *
 * `../2-guides/2.14-server-actions.md` → `/guides/server-actions`
 *
 * 문서 URL이 md 경로를 미러링한다는 계약을 코드로 옮긴 것입니다
 * ([03. 3-1](../../../../docs/03-composition-architecture.md)).
 */
export function resolveDocLink(href: string, docPath?: string): string {
  if (!href) return ''
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('#') ||
    href.startsWith('tel:')
  ) {
    return href
  }

  // 앵커 분리
  const hashIdx = href.indexOf('#')
  const rawTarget = hashIdx !== -1 ? href.slice(0, hashIdx) : href
  const hash = hashIdx !== -1 ? href.slice(hashIdx) : ''

  if (!rawTarget) {
    return hash || '#'
  }

  // docPath 기준으로 상대 경로를 푼다
  let combined = rawTarget
  if (docPath) {
    const lastSlash = docPath.lastIndexOf('/')
    const baseDir = lastSlash !== -1 ? docPath.slice(0, lastSlash) : ''
    const baseParts = baseDir ? baseDir.split('/') : []
    const targetParts = rawTarget.split('/')
    const mergedParts = [...baseParts, ...targetParts]

    const normalizedParts: string[] = []
    for (const p of mergedParts) {
      if (!p || p === '.') continue
      if (p === '..') {
        normalizedParts.pop()
      } else {
        normalizedParts.push(p)
      }
    }
    combined = normalizedParts.join('/')
  }

  // 최상위 README.md는 홈
  if (combined === 'README.md' || combined === '') {
    return '/' + hash
  }

  const parts = combined.split('/')
  const filename = parts.pop() || ''
  const cleanedDirs = parts.map(cleanSegment)

  if (filename === 'README.md') {
    return '/' + cleanedDirs.join('/') + hash
  }

  const cleanFilename = cleanSegment(filename.replace(/\.md$/, ''))
  const fullSlug = [...cleanedDirs, cleanFilename].filter(Boolean)
  return '/' + fullSlug.join('/') + hash
}
