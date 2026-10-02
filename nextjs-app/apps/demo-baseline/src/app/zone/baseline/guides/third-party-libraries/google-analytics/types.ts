// 실제 GA4 속성이 아닌 데모용 측정 ID다. 이 ID로는 어떤 보고서에도 데이터가 쌓이지 않는다.
export const DEMO_GA_ID = 'G-DEMO000000'
export const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${DEMO_GA_ID}`
// gtag.js 공식 opt-out 플래그. 켜 두면 gtag.js가 로드돼도 collect 요청(측정 전송)을 보내지 않는다.
export const GA_OPT_OUT_KEY = `ga-disable-${DEMO_GA_ID}`

// 셸·다른 코드가 같은 dataLayer에 push해도 섞이지 않도록 데모 전용 이벤트명으로 필터한다.
export const DEMO_EVENT_NAME = 'demo_add_to_cart'
export const DEMO_EVENT_PARAMS = { currency: 'KRW', value: 129000, item_id: 'sku-1024' }

export const GA_HOSTS = ['www.googletagmanager.com', 'www.google-analytics.com', 'region1.google-analytics.com']

export type ScriptLoad = 'idle' | 'loading' | 'loaded' | 'error' | 'timeout'

/** DOM·window·performance에서 읽은 GoogleAnalytics 컴포넌트의 실제 흔적 */
export interface GaSnapshot {
  /** <script id="_next-ga-init"> 존재 여부와 그 안의 gtag('config', ID) 포함 여부 */
  initScript: boolean
  initHasConfig: boolean
  /** <script id="_next-ga">의 src와 next/script가 남긴 data-nscript(로드 전략) */
  extScriptSrc: string | null
  extStrategy: string | null
  /** App Router에서 afterInteractive가 ReactDOM.preload로 넣는 <link rel="preload"> */
  preloadLink: boolean
  dataLayerLength: number | null
  gtagType: string
  /** dataLayer 항목 중 gtag 명령(arguments 형태)의 첫 인자 목록 */
  commands: string[]
  /** 외부 호스트별 요청 수 (performance resource 항목) */
  externalHosts: Record<string, number>
  collectRequests: number
}

/** sendGAEvent 호출 전후 dataLayer 길이 차이로 본 push 결과 */
export interface PushResult {
  phase: 'before-mount' | 'after-mount'
  before: number | null
  after: number | null
  /** 이번 호출로 늘어난 항목(배열로 직렬화) */
  pushed: unknown[][]
  at: string
}
