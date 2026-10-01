import type { TenantTheme } from './lib/tenants'

/** Route Handler(api/tenant)가 되돌려 주는 JSON. 서버가 실제로 받은 헤더를 담는다. */
export interface TenantResponse {
  host: string | null
  forwardedHost: string | null
  effectiveHost: string | null
  source: 'host' | 'x-forwarded-host'
  label: string | null
  tenant: TenantTheme | null
  handledAt: string
}

/** Server Action 이 같은 앱의 Route Handler 를 실제 HTTP 로 호출한 결과 */
export interface ProbeResult {
  scenarioId: string
  /** 보낸 요청 헤더 (이름 → 값) */
  sent: Record<string, string>
  status: number | null
  body: TenantResponse | null
  error: string | null
}
