import type { LiveSnapshot, TenantSnapshot } from '../types'
import { TENANTS, UNKNOWN_TENANT, getTenant, hexToRgb } from './tenants'

export interface Check {
  label: string
  /** undefined 이면 아직 측정 전이다 */
  ok: boolean | undefined
  detail: string
}

/** 측정값만으로 판정한다. 하드코딩된 성공 값은 없다. */
export function judge(probe: TenantSnapshot[] | null, live: LiveSnapshot | null): Check[] {
  const known = probe?.filter((s) => s.id !== UNKNOWN_TENANT)
  const unknown = probe?.find((s) => s.id === UNKNOWN_TENANT)
  const cfg = live?.tenant ? getTenant(live.tenant) : undefined
  const liveTitleRef = probe?.find((s) => s.id === live?.tenant)?.title

  const routes = probe && known && unknown
    ? known.every((s) => s.status === 200 && s.rootId === s.id && s.logo === getTenant(s.id)?.logo) && unknown.status === 404 && unknown.rootId === null
    : undefined
  const vars = known ? known.every((s) => s.primaryVar?.toLowerCase() === getTenant(s.id)?.primary && s.accentVar?.toLowerCase() === getTenant(s.id)?.accent) &&
    new Set(known.map((s) => s.primaryVar)).size === TENANTS.length : undefined
  const titles = known ? known.every((s) => !!s.title?.includes(getTenant(s.id)?.name ?? '\0')) && new Set(known.map((s) => s.title)).size === TENANTS.length : undefined
  const isolated = known ? known.every((s) => s.leaked.length === 0) : undefined

  return [
    {
      label: '/acme · /globex · /initech 는 200 + 자기 테넌트 영역·로고, /umbrella 는 404',
      ok: routes,
      detail: probe ? probe.map((s) => `${s.id}=${s.status}${s.rootId ? `(${s.logo})` : ''}`).join(' · ') : '[테넌트 실측 실행]을 눌러 주세요',
    },
    {
      label: '응답 HTML 에 주입된 CSS 변수가 테넌트 설정과 같고 서로 다르다',
      ok: vars,
      detail: known ? known.map((s) => `${s.id}: ${s.primaryVar}/${s.accentVar}`).join(' · ') : '실측 전',
    },
    {
      label: '테넌트마다 generateMetadata 의 title 이 다르다',
      ok: titles,
      detail: known ? known.map((s) => `${s.id}="${s.title}"`).join(' · ') : '실측 전',
    },
    {
      label: '한 테넌트 응답에 다른 테넌트의 이름·색상이 섞이지 않는다',
      ok: isolated,
      detail: known ? known.map((s) => `${s.id}: ${s.leaked.length ? `유입 ${s.leaked.join(', ')}` : '없음'}`).join(' · ') : '실측 전',
    },
    {
      label: '현재 화면의 getComputedStyle 값이 테넌트 설정과 일치한다',
      ok: live && cfg ? live.primaryVar.toLowerCase() === cfg.primary && live.swatchRgb === hexToRgb(cfg.primary) && live.logoFillRgb === hexToRgb(cfg.primary) && live.logo === cfg.logo : undefined,
      detail: live && cfg ? `--brand-primary=${live.primaryVar}, 견본=${live.swatchRgb}, 로고 fill=${live.logoFillRgb}` : '테넌트 링크를 눌러 이동해 주세요',
    },
    {
      label: '현재 document.title 이 해당 테넌트 응답의 title 과 같다',
      ok: live && cfg && liveTitleRef ? live.title === liveTitleRef && live.title.includes(cfg.name) : undefined,
      detail: live ? `document.title="${live.title}"${liveTitleRef ? '' : ' (응답 title 은 실측 후 비교)'}` : '테넌트 링크를 눌러 이동해 주세요',
    },
  ]
}

/** 하나라도 실패면 false, 전부 통과면 true, 그 외는 대기. */
export function overall(checks: Check[]): boolean | undefined {
  if (checks.some((c) => c.ok === false)) return false
  return checks.every((c) => c.ok === true) ? true : undefined
}
