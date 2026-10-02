import type { TagCounts } from './types'

// content/spec.mdx 원본을 손으로 센 값. 렌더 결과(DOM 실측)와 대조한다.
// p 6 = 소개, 인용문 안 문단, 표 안내, 표가 되지 못한 파이프 텍스트, JSX 안내, 링크 문단
// code 5 = 인라인 코드 4개 + 펜스 코드 블록(pre > code) 1개
// table 1 = JSX로 쓴 표뿐. 마크다운 파이프 표는 remark-gfm이 없어 표가 되지 않는다.
export const EXPECTED_COUNTS: TagCounts = {
  h1: 1,
  h2: 4,
  p: 6,
  ul: 1,
  ol: 1,
  li: 6,
  blockquote: 1,
  pre: 1,
  code: 5,
  a: 1,
  table: 1,
}

export const EXPECTED_PIPE_PARAGRAPHS = 1
export const EXPECTED_JSX_TABLES = 1
/** spec-sheet/page.mdx의 export const metadata.title 앞부분 (루트 layout의 title.template이 뒤에 붙는다) */
export const SPEC_SHEET_TITLE = 'RUN-001 기술 사양서 (page.mdx 라우트)'
