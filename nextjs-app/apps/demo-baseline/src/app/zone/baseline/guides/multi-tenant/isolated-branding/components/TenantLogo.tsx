import type { Tenant } from '../lib/tenants'

/** public/ 없이 쓰는 인라인 SVG 로고. fill 이 CSS 변수라 테넌트 영역의 --brand-primary 를 그대로 따른다. */
export function TenantLogo({ logo }: { logo: Tenant['logo'] }) {
  const fill = { fill: 'var(--brand-primary)' }
  return (
    <svg data-logo={logo} width="40" height="40" viewBox="0 0 40 40" role="img" aria-label={`${logo} 로고`}>
      {logo === 'circle' && <circle data-logo-shape cx="20" cy="20" r="16" style={fill} />}
      {logo === 'diamond' && <rect data-logo-shape x="9" y="9" width="22" height="22" transform="rotate(45 20 20)" style={fill} />}
      {logo === 'triangle' && <polygon data-logo-shape points="20,4 36,34 4,34" style={fill} />}
    </svg>
  )
}
