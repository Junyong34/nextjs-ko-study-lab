import type { DemoConfigPart } from './types'

// 이 모듈은 단일 데모(config/redirects/header-query-condition)가 소유한다.
// source는 이 데모의 가상 경로(<BASE>/probe/*)로만 한정해 다른 데모·셸 라우팅에 영향을 주지 않는다.
// 데모 화면(lib/judge.ts, RuleList)도 이 배열을 그대로 읽어 "화면에 보이는 규칙 = 실제 적용된 설정"을 유지한다.
export const CONDITION_BASE = '/zone/baseline/config/redirects/header-query-condition'

export type ConditionRuleId = 'header' | 'query' | 'cookie' | 'host' | 'missing' | 'combo'

// next의 RouteHas와 같은 모양: host는 key 없이 value만, 나머지는 key 필수.
export type HasItem =
  | { type: 'header' | 'query' | 'cookie'; key: string; value?: string }
  | { type: 'host'; key?: undefined; value: string }

export type ConditionRule = {
  id: ConditionRuleId
  label: string
  source: string
  has?: HasItem[]
  missing?: HasItem[]
  destination: string
  permanent: false
}

const rule = (r: Omit<ConditionRule, 'source' | 'permanent'>): ConditionRule => ({
  ...r,
  source: `${CONDITION_BASE}/probe/${r.id}`,
  permanent: false,
})

export const conditionRules: ConditionRule[] = [
  rule({
    id: 'header',
    label: 'has: header',
    has: [{ type: 'header', key: 'x-beta-tester', value: 'true' }],
    destination: `${CONDITION_BASE}/arrived?via=header`,
  }),
  rule({
    id: 'query',
    label: 'has: query + 값 캡처',
    // 정규식 이름 캡처 그룹 (?<campaign>...)의 값을 destination의 :campaign으로 재사용한다.
    has: [{ type: 'query', key: 'ref', value: '(?<campaign>[a-z0-9-]+)' }],
    destination: `${CONDITION_BASE}/arrived?via=query&campaign=:campaign`,
  }),
  rule({
    id: 'cookie',
    label: 'has: cookie',
    has: [{ type: 'cookie', key: 'demo_beta', value: 'on' }],
    destination: `${CONDITION_BASE}/arrived?via=cookie`,
  }),
  rule({
    id: 'host',
    label: 'has: host',
    // host 타입은 key 없이 value만 쓴다.
    has: [{ type: 'host', value: 'beta.demo.test' }],
    destination: `${CONDITION_BASE}/arrived?via=host`,
  }),
  rule({
    id: 'missing',
    label: 'missing: header',
    // 이 헤더가 "없을 때만" 리다이렉트한다.
    missing: [{ type: 'header', key: 'x-skip-redirect' }],
    destination: `${CONDITION_BASE}/arrived?via=missing`,
  }),
  rule({
    id: 'combo',
    label: 'has 두 개 (AND)',
    has: [
      { type: 'header', key: 'x-beta-tester', value: 'true' },
      { type: 'cookie', key: 'demo_beta', value: 'on' },
    ],
    destination: `${CONDITION_BASE}/arrived?via=combo`,
  }),
]

export const demoConfig: DemoConfigPart = {
  redirects: conditionRules.map(({ source, has, missing, destination, permanent }) => ({
    source,
    ...(has && { has }),
    ...(missing && { missing }),
    destination,
    permanent,
  })),
}
