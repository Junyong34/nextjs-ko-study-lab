// 렌더된 DOM에서 개수를 세는 태그. 마크다운 문법이 어떤 HTML 요소로 바뀌었는지 보는 기준이다.
export const COUNTED_TAGS = ['h1', 'h2', 'p', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'table'] as const
export type CountedTag = (typeof COUNTED_TAGS)[number]
export type TagCounts = Record<CountedTag, number>

/** content/spec.mdx가 `export const specMeta`로 내보내는 값 (frontmatter 대안) */
export interface SpecMeta {
  sku: string
  name: string
  revision: string
  updatedAt: string
}

/** 실습 화면에 렌더된 MDX 영역의 DOM 실측 결과 */
export interface DomCensus {
  counts: TagCounts
  /** GFM 표 문법(| --- |)이 표가 되지 못하고 문단(p) 텍스트로 남은 개수 */
  pipeParagraphs: number
  /** JSX로 쓴 <table data-source="jsx"> 개수 */
  jsxTables: number
  measuredAt: string
}

/** spec-sheet/page.mdx 라우트를 문서 요청으로 받아 본 결과 */
export interface RouteProbe {
  status: number
  contentType: string
  title: string | null
  h1Text: string | null
  ms: number
}

export type Prediction = 'table' | 'text'
