import type { NavigationState } from '../hooks/useNavigationState'
import type { Check, DynamicProbe, RscRequest } from '../types'
import { UNKNOWN_ID } from './products'

/** 라우터가 탐색에 쓴 RSC 요청이 서버 모드 규칙(_rsc 쿼리, rsc: 1 헤더, text/x-component 응답)을 따르는지 */
export function isServerModeRsc(r: RscRequest) {
  return !!r.rscQuery && r.rscHeader === '1' && r.status === 200 && (r.contentType ?? '').startsWith('text/x-component')
}

function rscCheck(requests: RscRequest[]): Check {
  // 프로덕션에서는 prefetch로 미리 받은 경로라면 탐색 때 새 요청이 없을 수 있어 prefetch 요청도 인정한다.
  const nav = requests.find((r) => r.kind === 'navigation') ?? requests[0]
  const base = { id: 'rsc', label: 'Link 이동 시 RSC 요청', expected: '_rsc 쿼리 + rsc: 1 헤더, 200 text/x-component 응답' }
  if (!nav) return { ...base, actual: '아직 탐색 요청이 없습니다. 상품 링크를 클릭하세요.', state: 'wait' }
  const actual = `${nav.kind === 'prefetch' ? '(prefetch) ' : ''}${nav.url} → rsc: ${nav.rscHeader ?? '없음'}, ${nav.status ?? nav.error}, ${nav.contentType ?? 'content-type 없음'}`
  return { ...base, actual, state: isServerModeRsc(nav) ? 'pass' : 'fail' }
}

function documentCheck(nav: NavigationState): Check {
  const base = { id: 'document', label: '문서를 다시 받지 않음', expected: '탐색 후에도 navigation 항목 1개, timeOrigin 동일, 레이아웃 상태 유지' }
  if (nav.softNavigations === 0) return { ...base, actual: '아직 경로가 바뀌지 않았습니다.', state: 'wait' }
  const ok = nav.documentEntries === 1 && nav.timeOriginSame
  const actual = `클라이언트 탐색 ${nav.softNavigations}회, navigation 항목 ${nav.documentEntries}개, timeOrigin ${nav.timeOriginSame ? '동일' : '변경'}, 장바구니 ${nav.cartCount}개 유지`
  return { ...base, actual, state: ok ? 'pass' : 'fail' }
}

function dynamicCheck(probes: DynamicProbe[] | null): Check {
  const base = { id: 'dynamic', label: 'generateStaticParams 밖의 id', expected: '목록에 있는 상품 200, 목록 밖 상품 404 (dynamicParams = false)' }
  if (!probes) return { ...base, actual: '[상세 경로 문서 요청]을 누르세요.', state: 'wait' }
  const known = probes.find((p) => !p.path.endsWith(UNKNOWN_ID))
  const unknown = probes.find((p) => p.path.endsWith(UNKNOWN_ID))
  const actual = probes.map((p) => `${p.path} → ${p.status}`).join(', ')
  return { ...base, actual, state: known?.status === 200 && unknown?.status === 404 ? 'pass' : 'fail' }
}

export function judge(requests: RscRequest[], nav: NavigationState, probes: DynamicProbe[] | null): Check[] {
  return [rscCheck(requests), documentCheck(nav), dynamicCheck(probes)]
}

export function overall(checks: Check[]): boolean | undefined {
  if (checks.some((c) => c.state === 'fail')) return false
  return checks.every((c) => c.state === 'pass') ? true : undefined
}
