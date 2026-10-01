import type { LiveSnapshot, TenantSnapshot } from '../types'
import { TENANTS, UNKNOWN_TENANT, tenantHref } from './tenants'

const cssVar = (style: string | null, name: string) => style?.match(new RegExp(`${name}:\\s*([^;]+)`))?.[1].trim() ?? null

/** 테넌트 URL 을 실제로 요청해 응답 HTML 을 파싱한다. 응답을 흉내 내지 않는다. */
export async function fetchTenant(id: string): Promise<TenantSnapshot> {
  const res = await fetch(tenantHref(id), { cache: 'no-store' })
  const doc = new DOMParser().parseFromString(await res.text(), 'text/html')
  const root = doc.querySelector('[data-tenant-root]')
  const style = root?.getAttribute('style') ?? null
  const scoped = (root?.outerHTML ?? '').toLowerCase()
  // 격리 판정은 테넌트 영역 안으로 한정한다. 바깥 내비게이션은 모든 테넌트 링크를 갖기 때문이다.
  const leaked = TENANTS.filter((t) => t.id !== id).flatMap((o) => [o.name, o.primary].filter((s) => scoped.includes(s.toLowerCase())))
  return {
    id,
    status: res.status,
    title: doc.title || null,
    rootId: root?.getAttribute('data-tenant') ?? null,
    primaryVar: cssVar(style, '--brand-primary'),
    accentVar: cssVar(style, '--brand-accent'),
    logo: root?.querySelector('[data-logo]')?.getAttribute('data-logo') ?? null,
    leaked,
  }
}

export const runProbe = () => Promise.all([...TENANTS.map((t) => t.id), UNKNOWN_TENANT].map(fetchTenant))

/** 화면에 실제로 렌더된 DOM 의 계산된 스타일을 읽는다. 테넌트 페이지가 아니면 null. */
export function measureLive(): LiveSnapshot | null {
  const root = document.querySelector('[data-tenant-root]')
  if (!root) return null
  const swatch = root.querySelector('[data-swatch="primary"]')
  const shape = root.querySelector('[data-logo-shape]')
  return {
    tenant: root.getAttribute('data-tenant'),
    title: document.title,
    primaryVar: getComputedStyle(root).getPropertyValue('--brand-primary').trim(),
    swatchRgb: swatch ? getComputedStyle(swatch).backgroundColor : '',
    logoFillRgb: shape ? getComputedStyle(shape).fill : null,
    logo: root.querySelector('[data-logo]')?.getAttribute('data-logo') ?? null,
  }
}
