/** 이 데모의 내부 라우트 경로 (zone 내부 URL) */
export const DEMO_BASE_PATH = '/zone/baseline/guides/css-in-js/style-registry'

export type RegistryVariant = 'with-registry' | 'without-registry'

/** 서버가 보낸 원본 HTML 하나를 분석한 결과 */
export interface HtmlAnalysis {
  variant: RegistryVariant
  status: number
  /** data-registry <style> 태그 총 개수 */
  styleTagCount: number
  /** 그중 </head> 앞(head 안)에 있는 개수 */
  headTagCount: number
  /** HTML 본문에서 사용 중인 sr-* 클래스 (중복 제거) */
  usedClasses: string[]
  /** <style> 안에 규칙이 존재하는 sr-* 클래스 (중복 제거) */
  ruleClasses: string[]
  /** 사용 중이지만 첫 HTML에 규칙이 없는 클래스 — 하이드레이션 전까지 스타일이 없다 */
  unstyledClasses: string[]
  /** 같은 selector의 규칙이 여러 번 실린 클래스 (dedupe 실패) */
  duplicateRules: string[]
  /** 첫 <style>이 sr-* 클래스를 쓰는 첫 요소보다 앞에 있는가 */
  styleBeforeFirstUse: boolean
  /** sr-* 클래스를 쓰는 요소가 HTML에 나타난 횟수 */
  usageCount: number
  snippet: string
}

export interface ServerProbeResult {
  withRegistry: HtmlAnalysis
  withoutRegistry: HtmlAnalysis
  fetchedAt: string
}

export interface StyleTagInfo {
  source: string
  parent: string
  bytes: number
  ruleCount: number
}

/** 하이드레이션이 끝난 뒤 브라우저 DOM을 직접 읽은 결과 */
export interface DomProbeResult {
  tags: StyleTagInfo[]
  duplicateSelectors: string[]
  computedBackground: string
  registered: number
  adopted: number
  injected: number
  /** 측정 시점까지 [클라이언트 규칙 추가]를 누른 횟수 */
  dynamicAdds: number
  measuredAt: string
}
