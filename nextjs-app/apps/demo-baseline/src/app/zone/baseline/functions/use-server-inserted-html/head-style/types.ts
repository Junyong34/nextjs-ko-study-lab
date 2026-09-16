export type ProbeVariant = 'with-hook' | 'without-hook'

export type ProductThemeKey = 'keyboard' | 'mouse'

export interface ThemeDefinition {
  className: string
  css: string
  label: string
}

/** 실제 라우트에서 받은 원본 SSR HTML을 분석한 결과 하나 */
export interface RegistryProbeResult {
  variant: ProbeVariant
  status: number
  /** <style data-demo-registry> 가 </head> 앞(head 안)에서 발견됐는가 */
  headInjectionFound: boolean
  /** <style data-demo-registry> 가 </head> 뒤(body 안, 스트리밍 후속 플러시)에서 발견됐는가 */
  bodyInjectionFound: boolean
  /** 원본 응답에서 발견된 data-demo-registry style 태그 총 개수 */
  styleTagCount: number
  /** </head> 부근을 잘라낸 원본 HTML 조각 (사람이 읽을 수 있게 표시) */
  headSnippet: string
  /** 두 번째(스트리밍 후속) 삽입 지점 부근을 잘라낸 원본 HTML 조각, 없으면 안내 문구 */
  bodySnippet: string
}

export interface RegistryComparisonResult {
  withHook: RegistryProbeResult
  withoutHook: RegistryProbeResult
  fetchedAt: string
}
