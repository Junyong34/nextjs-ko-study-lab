/** 서브도메인 첫 라벨 → 테넌트 설정. 서버(Route Handler)와 검증(클라이언트)이 함께 쓴다. */
export interface TenantTheme {
  id: string
  name: string
  primary: string
}

export const TENANTS: Record<string, TenantTheme> = {
  acme: { id: 'acme', name: 'Acme 스포츠', primary: '#2563eb' },
  globex: { id: 'globex', name: 'Globex 마켓', primary: '#dc2626' },
  initech: { id: 'initech', name: 'Initech 스테이션', primary: '#059669' },
}

/** 테넌트 라벨로 보지 않는 첫 라벨. 루트 도메인(localhost)과 www 는 테넌트가 없다. */
const RESERVED_LABELS = new Set(['localhost', 'www', '127', '0'])

export interface Resolution {
  /** 포트를 뗀 호스트명 */
  hostname: string
  /** 첫 라벨 */
  label: string | null
  /** 등록된 테넌트. 라벨이 없거나 미등록이면 null */
  tenant: TenantTheme | null
}

/** Host 값(포트 포함 가능)의 첫 라벨을 테넌트로 해석한다. 순수 함수라 서버·클라이언트 모두 쓴다. */
export function resolveTenant(host: string | null | undefined): Resolution {
  const hostname = (host ?? '').split(',')[0].trim().toLowerCase().replace(/:\d+$/, '')
  const parts = hostname.split('.').filter(Boolean)
  // acme.localhost 처럼 라벨이 둘 이상일 때만 첫 라벨이 서브도메인이다.
  const label = parts.length >= 2 && !RESERVED_LABELS.has(parts[0]) && !/^\d+$/.test(parts[0]) ? parts[0] : null
  return { hostname, label, tenant: label ? (TENANTS[label] ?? null) : null }
}
