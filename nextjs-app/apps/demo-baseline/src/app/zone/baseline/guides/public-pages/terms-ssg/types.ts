export type TermsLang = 'ko' | 'en'

/** 약관 문서 한 벌. 모든 사용자에게 같은 내용이므로 빌드 때 HTML로 만들어 둘 수 있다. */
export interface TermsDoc {
  lang: TermsLang
  version: string
  title: string
  effectiveDate: string
  articles: { heading: string; body: string }[]
}

/**
 * 실측 대상 URL의 성격.
 * - prebuilt: generateStaticParams가 반환한 조합 → next build 표에서 ●(SSG)
 * - unknown: generateStaticParams에 없는 조합 + dynamicParams=false → 404
 * - runtime-api: 같은 generateStaticParams를 쓰지만 page가 cookies()를 호출 → ƒ
 */
export type TargetKind = 'prebuilt' | 'unknown' | 'runtime-api'

export interface ProbeTarget {
  key: string
  href: string
  label: string
  kind: TargetKind
}

/** fetch 한 번으로 실제 관측한 값 */
export interface ProbeSample {
  status: number
  renderId: string | null
  renderedAt: string | null
  xNextjsCache: string | null
  xNextjsPrerender: string | null
  cacheControl: string | null
}

export interface TargetResult {
  target: ProbeTarget
  samples: ProbeSample[]
  uniqueIds: number
  /** 실측 시작 시각(ISO). 사전 생성 page의 렌더 시각이 이보다 과거인지 비교한다. */
  probedAt: string
  /** 판정에 쓴 조건별 결과 (사람이 읽는 문장) */
  checks: { label: string; ok: boolean }[]
  ok: boolean
}

export type RunMode = 'development' | 'production'
