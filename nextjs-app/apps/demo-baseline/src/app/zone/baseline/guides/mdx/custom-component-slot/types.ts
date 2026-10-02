import type { Cart } from './lib/cart'

/** api/cart Route Handler 응답 */
export interface CartResponse {
  cart: Cart
  count: number
  handledAt: string
  error?: string
}

/** page.tsx(서버)가 내려주는 식별 문구. 클라이언트 코드에 문자열로 적으면 그 자체가 번들에 들어가므로 props로만 받는다. */
export interface BundleMarkers {
  prose: string
  button: string
}

/** [경계 측정] 한 번의 결과 */
export interface SlotMeasurement {
  mdxEnv: string | null
  buttonHydrated: boolean
  domCartCount: number | null
  serverCartCount: number
  h2Total: number
  h2Local: number
  h2Global: number
  pGlobal: number
  calloutCount: number
  scriptsScanned: number
  buttonMarkerHits: number
  proseMarkerHits: number
  measuredAt: string
}
