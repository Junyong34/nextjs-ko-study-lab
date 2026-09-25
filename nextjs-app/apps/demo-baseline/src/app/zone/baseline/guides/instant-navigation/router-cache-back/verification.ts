import { KIND_LABEL, groupOf, type NavGroup, type NavRecord, type RouterCacheVerdict } from './types'

export const GROUP_LABEL: Record<NavGroup, string> = {
  history: '뒤로/앞으로 (popstate)',
  link: '<Link> 새 진입',
  refresh: 'router.refresh()',
}

/** 판정 대상 기록. 뒤로/앞으로는 refresh 이후 복원(afterRefresh)을 제외한다 — 관찰 항목으로 따로 보여준다. */
export function recordsOf(records: NavRecord[], group: NavGroup) {
  return records.filter((r) => groupOf(r.kind) === group && !r.afterRefresh)
}

/** router.refresh() 이후, 그 전에 떠났던 경로로 뒤로/앞으로 돌아간 기록 */
export function afterRefreshRecords(records: NavRecord[]) {
  return records.filter((r) => r.afterRefresh)
}

export function averageMs(records: NavRecord[]): number | null {
  const ms = records.map((r) => r.durationMs).filter((v): v is number => v !== null)
  return ms.length === 0 ? null : Math.round(ms.reduce((a, b) => a + b, 0) / ms.length)
}

function checkRow(r: NavRecord, reasons: string[]) {
  const group = groupOf(r.kind)
  if (group === null || r.rscCount === null || r.afterRefresh) return true
  const label = `#${r.seq} ${KIND_LABEL[r.kind]}`
  if (group === 'history') {
    if (r.rscCount !== 0) reasons.push(`${label}: RSC 요청이 ${r.rscCount}건 관측됐습니다(0건이어야 함).`)
    if (!r.reused) reasons.push(`${label}: 이전 렌더 ID가 아닌 새 렌더 ID(${r.renderId})가 도착했습니다.`)
    return r.rscCount === 0 && r.reused
  }
  if (r.rscCount < 1) reasons.push(`${label}: 서버 요청이 관측되지 않았습니다(1건 이상이어야 함).`)
  if (r.reused) reasons.push(`${label}: 이전 렌더 ID(${r.renderId})가 재사용됐습니다(새 렌더여야 함).`)
  return r.rscCount >= 1 && !r.reused
}

/**
 * 세 이동 방식을 각각 1회 이상 측정한 뒤 판정한다.
 * - 뒤로/앞으로: RSC 요청 0건 + 이전 렌더 ID 재사용 (Client Cache에서 복원)
 *   단, router.refresh() 뒤에 그 전에 떠났던 경로로 돌아간 기록은 판정에서 빼고 관찰값으로만 보여준다.
 * - <Link> 새 진입, router.refresh(): RSC 요청 1건 이상 + 새 렌더 ID (동적 page는 서버에서 다시 렌더)
 * - 평균 이동→커밋 시간: 뒤로/앞으로 < <Link> 새 진입
 */
export function evaluate(records: NavRecord[]): RouterCacheVerdict {
  const groups: NavGroup[] = ['history', 'link', 'refresh']
  const missing = groups.filter((g) => recordsOf(records, g).length === 0)
  if (missing.length > 0) {
    return {
      isMatched: undefined,
      reasons: [`아직 측정하지 않은 방식: ${missing.map((g) => GROUP_LABEL[g]).join(', ')}`],
    }
  }

  const reasons: string[] = []
  const rowsOk = records.map((r) => checkRow(r, reasons)).every(Boolean)

  const historyAvg = averageMs(recordsOf(records, 'history'))
  const linkAvg = averageMs(recordsOf(records, 'link'))
  const fasterOk = historyAvg !== null && linkAvg !== null && historyAvg < linkAvg
  if (!fasterOk) reasons.push(`평균 소요: 뒤로/앞으로 ${historyAvg}ms가 <Link> 새 진입 ${linkAvg}ms보다 빠르지 않습니다.`)

  const isMatched = rowsOk && fasterOk
  if (isMatched) reasons.push('모든 조건을 실측값이 만족했습니다.')
  return { isMatched, reasons }
}
