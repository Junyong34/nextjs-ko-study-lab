// content/sample.mdx 원본 기준: h1 1, h2 1, p 2, code 1, a 1 → 전역 매핑 대상 요소 6개.
export const EXPECTED_SEQUENCE = ['h1', 'h2', 'p', 'code', 'p', 'a']
export const MAPPED_SELECTOR = 'h1, h2, p, a, code'
/** 전역 매핑이 켜는 테마 래퍼의 data 속성 값 (mdx-components.tsx의 [[data-mdx-theme=store]_&] 변형과 짝) */
export const THEME_NAME = 'store'
