import type { RedirectCase } from '../types'

// 기대값은 redirects 공식 문서의 매칭 규칙(path-to-regexp)에서 도출한 값이다.
// 실제 응답은 probe/route.ts가 서버에서 측정하며, 이 표와 일치하는지 lib/judge.ts가 판정한다.
export const CASES: RedirectCase[] = [
  { id: 'c1', rule: 0, label: '연도 4자리 + 숫자 id', path: '/catalog/2024/1001', expectStatus: 308, expectLocation: '/products/2024/1001' },
  { id: 'c2', rule: 0, label: '쿼리 문자열은 그대로 전달', path: '/catalog/2023/7?ref=mail', expectStatus: 308, expectLocation: '/products/2023/7?ref=mail' },
  { id: 'c3', rule: 0, label: '연도가 2자리 → (\\d{4}) 불일치', path: '/catalog/24/1001', expectStatus: 404, expectLocation: null },
  { id: 'c4', rule: 0, label: 'id가 숫자가 아님 → (\\d+) 불일치', path: '/catalog/2024/abc', expectStatus: 404, expectLocation: null },
  { id: 'c5', rule: 1, label: '중첩 3단계 경로 와일드카드', path: '/legacy/a/b/c', expectStatus: 307, expectLocation: '/archive/a/b/c' },
  { id: 'c6', rule: 1, label: ':path* 는 0개 세그먼트도 일치', path: '/legacy', expectStatus: 307, expectLocation: '/archive' },
  { id: 'c7', rule: 2, label: '대안 그룹에 있는 locale(ko)', path: '/lang/ko/intro', expectStatus: 307, expectLocation: '/localized/ko/intro' },
  { id: 'c8', rule: 2, label: '대안 그룹에 없는 locale(fr)', path: '/lang/fr/intro', expectStatus: 404, expectLocation: null },
  { id: 'c9', rule: 3, label: '이스케이프한 리터럴 괄호', path: '/english(default)/hello', expectStatus: 308, expectLocation: '/localized/en/hello' },
]
