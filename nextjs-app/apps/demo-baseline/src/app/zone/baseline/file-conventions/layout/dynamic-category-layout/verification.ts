import type { CheckResult, LayoutReport, PageReport, Transition } from './types'
import { BASE } from './catalog'

export interface PairedEvidence {
  layout: LayoutReport
  page: PageReport
}

const short = (id: string) => id.slice(0, 8)
/** 표시용: 데모 기준 경로를 떼어 낸 상대 경로 */
const rel = (location: string) => location.slice(BASE.length) || '/'

function keysOf(json: string): string[] {
  try {
    return Object.keys(JSON.parse(json) as Record<string, unknown>)
  } catch {
    return []
  }
}

function isInitialState(r: LayoutReport) {
  return r.counter === 0 && r.memo === ''
}

/** [item] 상세 페이지에서 layout params에는 item 키가 없고 page params에는 있는지 */
export function checkParamsScope(evidence: PairedEvidence | null): CheckResult {
  const label = 'layout params 범위'
  if (!evidence) {
    return { label, status: 'pending', detail: '아직 상품 상세([category]/[item]) 경로를 방문하지 않았습니다.' }
  }
  const layoutKeys = keysOf(evidence.layout.paramsJson)
  const pageKeys = keysOf(evidence.page.paramsJson)
  const pass =
    layoutKeys.length === 1 && layoutKeys[0] === 'category' && pageKeys.includes('item') && pageKeys.includes('category')
  return {
    label,
    status: pass ? 'pass' : 'fail',
    detail: `${rel(evidence.page.pathname)}에서 layout params ${evidence.layout.paramsJson} / page params ${evidence.page.paramsJson}`,
  }
}

/** 쿼리가 붙은 경로에서 page는 searchParams를 받았지만 layout props에는 searchParams 키가 없는지 */
export function checkNoSearchParams(evidence: PairedEvidence | null): CheckResult {
  const label = 'layout에 searchParams 없음'
  if (!evidence) {
    return { label, status: 'pending', detail: '아직 쿼리(?sort=)가 붙은 경로를 방문하지 않았습니다.' }
  }
  const pass = !evidence.layout.propKeys.includes('searchParams')
  return {
    label,
    status: pass ? 'pass' : 'fail',
    detail: `layout props 키 [${evidence.layout.propKeys.join(', ')}] / page searchParams ${evidence.page.searchParamsJson}`,
  }
}

/** 같은 category 안에서 이동: layout 서버 렌더 ID·mount ID·클라이언트 상태가 그대로인지 */
export function checkSameCategory(t: Transition | null): CheckResult {
  const label = '같은 category 안 이동'
  if (!t) {
    return { label, status: 'pending', detail: '아직 같은 카테고리 안에서 다른 page(상품·정렬)로 이동하지 않았습니다.' }
  }
  const path = `${rel(t.from.location)} → ${rel(t.to.location)}`
  if (isInitialState(t.from)) {
    return {
      label,
      status: 'pending',
      detail: `${path}: 이동 전 메모·카운터가 초기값이라 유지 여부를 판단할 수 없습니다. 값을 바꾼 뒤 다시 이동하세요.`,
    }
  }
  const renderSame = t.from.renderId === t.to.renderId
  const mountSame = t.from.mountId === t.to.mountId
  const stateSame = t.from.counter === t.to.counter && t.from.memo === t.to.memo
  return {
    label,
    status: renderSame && mountSame && stateSame ? 'pass' : 'fail',
    detail: `${path}: render ID ${short(t.from.renderId)}→${short(t.to.renderId)}, mount ID ${short(t.from.mountId)}→${short(t.to.mountId)}, 카운터 ${t.from.counter}→${t.to.counter}, 메모 "${t.from.memo}"→"${t.to.memo}"`,
  }
}

/** category 값이 바뀌는 이동: layout이 서버에서 다시 렌더되고 클라이언트 상태가 초기화되는지 */
export function checkCategoryChange(t: Transition | null): CheckResult {
  const label = 'category 값 변경'
  if (!t) {
    return { label, status: 'pending', detail: '아직 다른 카테고리로 이동하지 않았습니다.' }
  }
  const path = `${rel(t.from.location)} → ${rel(t.to.location)}`
  if (isInitialState(t.from)) {
    return {
      label,
      status: 'pending',
      detail: `${path}: 이동 전 메모·카운터가 초기값이라 초기화 여부를 판단할 수 없습니다. 값을 바꾼 뒤 다시 이동하세요.`,
    }
  }
  const renderChanged = t.from.renderId !== t.to.renderId
  const mountChanged = t.from.mountId !== t.to.mountId
  const reset = isInitialState(t.to)
  return {
    label,
    status: renderChanged && mountChanged && reset ? 'pass' : 'fail',
    detail: `${path}: render ID ${short(t.from.renderId)}→${short(t.to.renderId)}, mount ID ${short(t.from.mountId)}→${short(t.to.mountId)}, 카운터 ${t.from.counter}→${t.to.counter}, 메모 "${t.from.memo}"→"${t.to.memo}"`,
  }
}

export function summarize(checks: CheckResult[]): boolean | undefined {
  if (checks.some((c) => c.status === 'fail')) return false
  if (checks.every((c) => c.status === 'pass')) return true
  return undefined
}
