export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

/** [표시기 측정] 한 번에 브라우저 DOM에서 읽은 값 */
export interface IndicatorProbe {
  measuredAt: string
  /** 클라이언트 번들에 빌드 때 인라인된 process.env.NODE_ENV */
  nodeEnv: string
  inIframe: boolean
  portalCount: number
  /** nextjs-portal의 shadowRoot를 스크립트에서 읽을 수 있었는지 (open 모드일 때만 true) */
  shadowReadable: boolean
  indicatorFound: boolean
  rect: { x: number; y: number; width: number; height: number } | null
  viewport: { width: number; height: number }
  /** 표시기 중심점이 현재 문서 뷰포트의 어느 사분면에 있는지 */
  corner: Corner | null
  /** Dev Tools 메뉴가 열려 있을 때만 존재하는 data-nextjs-route-type 값 */
  routeType: string | null
}
