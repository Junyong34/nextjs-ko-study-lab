export interface ProfileSpec {
  label: string
  stale: number
  revalidate: number
  expire: number
}

/**
 * next.config.ts의 cacheLife['functions-cache-life-custom-profile:restock-alert']에 정의한 값과 동일하다
 * (Next.js 16.3.2부터 cacheComponents와 마찬가지로 cacheLife도 experimental이 아니라
 * next.config.ts 최상위 필드다). 이 데모 전용 커스텀 프로필로, 내장 프리셋
 * (seconds/minutes/hours/...) 중 어느 것과도 stale/revalidate/expire 초 값이 겹치지 않는다.
 *
 * 'use cache'/next/cache import가 없는 별도 파일로 분리했다 — cachedData.ts(서버 전용,
 * next/cache 의존)를 클라이언트 컴포넌트가 직접 import하면 그 의존성까지 클라이언트 번들에
 * 유입되어 빌드 에러가 나기 때문이다.
 */
export const CUSTOM_PROFILE_SPEC: ProfileSpec = {
  label: "cacheLife('functions-cache-life-custom-profile:restock-alert')",
  stale: 20,
  revalidate: 45,
  expire: 240,
}

/**
 * 대비용 내장 프리셋. Next.js 16.3.2 공식 문서(cacheLife.md → "Preset cache profiles" 표)의
 * minutes 프리셋 값을 그대로 쓴다 — 커스텀 프로필과 달리 이 값은 next.config.ts에 아무것도
 * 정의하지 않아도 이미 존재한다.
 */
export const BUILTIN_COMPARE_SPEC: ProfileSpec = {
  label: "cacheLife('minutes')",
  stale: 300,
  revalidate: 60,
  expire: 3600,
}
