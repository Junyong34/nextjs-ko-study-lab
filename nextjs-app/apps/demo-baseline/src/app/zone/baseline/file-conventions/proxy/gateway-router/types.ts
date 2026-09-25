// 게이트웨이 라우팅 테이블 — proxy.ts(src/proxy.ts 분기 8)의 GATEWAY_SERVICE_TABLE과
// 동일한 매핑을 화면 표시·요청 URL 구성용으로 미러링한다. proxy.ts를 수정할 때는 이 표도
// 함께 갱신해야 한다.

export const GATEWAY_BASE_PATH = '/zone/baseline/file-conventions/proxy/gateway-router'

export interface GatewayRoute {
  /** proxy.ts가 매칭하는 경로 접두사 */
  prefix: string
  /** 클라이언트가 실제로 요청하는 절대 경로 */
  requestPath: string
  /** proxy.ts가 rewrite로 연결하는 내부 서비스 식별자 (x-gateway-target-service 기대값) */
  service: string
  /** 화면에 표시할 한국어 라벨 */
  label: string
  /** 데모용 내부 업스트림 포트 (x-gateway-upstream-port 기대값) */
  port: number
}

export const GATEWAY_ROUTES: GatewayRoute[] = [
  {
    prefix: 'orders',
    requestPath: `${GATEWAY_BASE_PATH}/api/orders`,
    service: 'order-service',
    label: '주문 서비스',
    port: 8081,
  },
  {
    prefix: 'inventory',
    requestPath: `${GATEWAY_BASE_PATH}/api/inventory`,
    service: 'inventory-service',
    label: '재고 서비스',
    port: 8082,
  },
  {
    prefix: 'search',
    requestPath: `${GATEWAY_BASE_PATH}/api/search`,
    service: 'search-service',
    label: '검색 서비스',
    port: 8083,
  },
]

/** 라우팅 테이블에 없는 접두사 — proxy.ts가 그대로 통과시켜 실제 404가 나야 하는 경로 */
export const UNROUTED_REQUEST_PATH = `${GATEWAY_BASE_PATH}/api/legacy-billing`

export interface GatewayProbeResult {
  requestedPath: string
  prefix: string
  status: number
  ok: boolean
  targetService: string | null
  matchedPrefix: string | null
  upstreamPort: string | null
  requestId: string | null
  body: unknown
  timestamp: string
}
