import type { Tenant } from '../lib/tenants'
import { TenantLogo } from './TenantLogo'

/** 서버 컴포넌트. 색은 하드코딩하지 않고 상위 [tenant]/layout.tsx 가 주입한 CSS 변수만 참조한다. */
export function TenantStorefront({ tenant }: { tenant: Tenant }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <TenantLogo logo={tenant.logo} />
        <div>
          <h3 data-tenant-name className="text-sm font-bold">{tenant.name}</h3>
          <p className="text-[11px] text-zinc-500">{tenant.tagline}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="rounded-md px-3 py-1.5 text-xs font-medium text-white" style={{ background: 'var(--brand-primary)' }}>
          장바구니 담기
        </button>
        <span className="rounded px-2 py-1 text-[11px]" style={{ background: 'var(--brand-accent)', color: 'var(--brand-primary)' }}>
          이번 주 특가
        </span>
        <span data-swatch="primary" className="h-5 w-10 rounded border border-zinc-300" style={{ background: 'var(--brand-primary)' }} />
        <span className="font-mono text-[10px] text-zinc-500">← --brand-primary 견본</span>
      </div>
    </div>
  )
}
