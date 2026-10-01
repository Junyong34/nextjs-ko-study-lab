import type { DemoConfigPart } from './types'

// 이 모듈은 단일 데모(config/redirects/regex-pattern-matching)가 소유한다.
// source는 반드시 데모 경로 하위의 가상 경로(실제 page가 없는 경로)로 한정한다 — 다른 데모·셸 라우팅에 영향 없음.
// 값을 바꾼 뒤에는 dev 서버를 재시작해야 반영된다(next.config의 redirects()는 서버 시작 때 한 번 읽힌다).
// https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects
export const REGEX_DEMO_BASE = '/zone/baseline/config/redirects/regex-pattern-matching'

export const demoConfig: DemoConfigPart = {
  redirects: [
    {
      // 정규식 그룹: 연도는 숫자 4자리, id는 숫자 1자리 이상만 일치. permanent: true → 308
      source: `${REGEX_DEMO_BASE}/catalog/:year(\\d{4})/:id(\\d+)`,
      destination: `${REGEX_DEMO_BASE}/products/:year/:id`,
      permanent: true,
    },
    {
      // 와일드카드 :path* — 0개 이상의 세그먼트(중첩 경로 포함). permanent: false → 307
      source: `${REGEX_DEMO_BASE}/legacy/:path*`,
      destination: `${REGEX_DEMO_BASE}/archive/:path*`,
      permanent: false,
    },
    {
      // 대안 그룹 (en|ko|ja): 나열한 값만 일치
      source: `${REGEX_DEMO_BASE}/lang/:locale(en|ko|ja)/:slug`,
      destination: `${REGEX_DEMO_BASE}/localized/:locale/:slug`,
      permanent: false,
    },
    {
      // 정규식 특수문자 ( ) 를 리터럴로 쓰려면 \\ 로 이스케이프한다
      source: `${REGEX_DEMO_BASE}/english\\(default\\)/:slug`,
      destination: `${REGEX_DEMO_BASE}/localized/en/:slug`,
      permanent: true,
    },
  ],
}
