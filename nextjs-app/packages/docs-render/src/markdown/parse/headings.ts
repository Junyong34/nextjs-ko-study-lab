import { slugify, stripInlineMarkup } from './slugify'

export interface HeadingItem {
  id: string
  alias?: string
  text: string
  level: number
  /** 용어집의 A~Z 구분 헤딩인지 (### A 형태) */
  isLetter?: boolean
  letter?: string
}

/**
 * 마크다운에서 h2~h4 헤딩을 뽑습니다. 코드블록 안의 `#`은 건너뜁니다.
 *
 * `TableOfContents`가 갖고 있던 `parseHeadings`입니다. 파싱은 마크다운의 일이라
 * 이 패키지가 소유하고, 목차 UI는 결과만 받아 그립니다.
 */
export function parseHeadings(content: string): HeadingItem[] {
  const lines = content.split('\n')
  const headings: HeadingItem[] = []
  let inCodeBlock = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    let level = 0
    let text = ''

    if (trimmed.startsWith('#### ')) {
      level = 4
      text = trimmed.slice(5).trim()
    } else if (trimmed.startsWith('### ')) {
      level = 3
      text = trimmed.slice(4).trim()
    } else if (trimmed.startsWith('## ')) {
      level = 2
      text = trimmed.slice(3).trim()
    }

    if (level > 0 && text) {
      const { primary, alias } = slugify(text)
      const cleanText = stripInlineMarkup(text)
      const isSingleLetter = level === 3 && /^[A-Z]$/i.test(cleanText)

      headings.push({
        id: primary,
        alias,
        text: cleanText,
        level,
        isLetter: isSingleLetter,
        letter: isSingleLetter ? cleanText.toUpperCase() : undefined,
      })
    }
  }

  return headings
}

/**
 * 용어집 문서인지 판정합니다. 용어집은 목차 대신 A~Z 색인 맵을 그립니다.
 *
 * 판정을 목차 컴포넌트에서 여기로 옮긴 이유: 이건 문서 내용에 대한 판단이라
 * 마크다운 쪽 관심사이고, 목차는 결과만 받으면 됩니다.
 */
export function isGlossaryDoc(
  content: string,
  headings: HeadingItem[],
  docPath?: string,
): boolean {
  return Boolean(
    (docPath && docPath.includes('glossary')) ||
      headings.some((h) => h.isLetter) ||
      content.includes('용어집 (Glossary)'),
  )
}
