/** 서버·클라이언트가 함께 쓰는 테넌트 설정과 경로 헬퍼. 브랜딩 값만 담으며 비밀 값은 두지 않는다. */
export const BASE_PATH = '/zone/baseline/guides/multi-tenant/isolated-branding'

export interface Tenant {
  id: string
  name: string
  tagline: string
  /** CSS 변수 --brand-primary 로 주입된다 */
  primary: string
  /** CSS 변수 --brand-accent 로 주입된다 */
  accent: string
  /** TenantLogo 가 그리는 인라인 SVG 모양 */
  logo: 'circle' | 'diamond' | 'triangle'
}

export const TENANTS: Tenant[] = [
  { id: 'acme', name: 'Acme 스포츠', tagline: '러닝화와 아웃도어 장비', primary: '#2563eb', accent: '#dbeafe', logo: 'circle' },
  { id: 'globex', name: 'Globex 마켓', tagline: '매일 배송되는 신선 식품', primary: '#dc2626', accent: '#fee2e2', logo: 'diamond' },
  { id: 'initech', name: 'Initech 스테이션', tagline: '개발자를 위한 사무용품', primary: '#059669', accent: '#d1fae5', logo: 'triangle' },
]

/** 등록되지 않은 테넌트. [tenant] 라우트에서 404가 되어야 한다. */
export const UNKNOWN_TENANT = 'umbrella'

export const getTenant = (id: string) => TENANTS.find((t) => t.id === id)
export const tenantHref = (id: string) => `${BASE_PATH}/${id}`

/** pathname 에서 BASE_PATH 다음 첫 세그먼트(= [tenant] 값)를 꺼낸다. 없으면 null. */
export function tenantFromPathname(pathname: string): string | null {
  const idx = pathname.indexOf(BASE_PATH)
  const rest = idx >= 0 ? pathname.slice(idx + BASE_PATH.length) : pathname
  return rest.split('/').filter(Boolean)[0] ?? null
}

/** #rrggbb → getComputedStyle 이 돌려주는 rgb(r, g, b) 문자열 */
export function hexToRgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}
