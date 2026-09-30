import { BASE, SLOT_SEGMENTS, type SlotName } from './constants'
import type { Snapshot } from './snapshot'

export interface Verdict { isMatched?: boolean; expected: string; actual: string }
const OTHER: Record<SlotName, SlotName> = { dashboard: 'metrics', metrics: 'dashboard' }
const line = (s: Snapshot) => `dashboard=${s.slots.dashboard.screen}(#${s.slots.dashboard.mountId}), metrics=${s.slots.metrics.screen}(#${s.slots.metrics.mountId})`

export function judge(prev: Snapshot | null, curr: Snapshot | null, viaAnchor: boolean): Verdict {
  const waiting = { expected: '슬롯 탭을 눌러 이동하면 판정합니다.', actual: '조작 대기 중' }
  if (!curr) return waiting
  const target = curr.pathname.startsWith(BASE + '/') ? curr.pathname.slice(BASE.length + 1) : null
  if (!target) return prev ? waiting : waiting
  const owner = (Object.keys(SLOT_SEGMENTS) as SlotName[]).find(n => SLOT_SEGMENTS[n].includes(target))
  if (!owner) return waiting
  const other = OTHER[owner]
  if (!prev || prev.pathname === curr.pathname) {
    // 이동 기록 없이 이 URL로 바로 로드된 경우(새로고침·직접 진입): 일치하지 않는 슬롯은 default.tsx
    const ok = curr.slots[owner].screen === target && curr.slots[other].screen === 'default'
    return { isMatched: ok, expected: `전체 로드: ${owner}=${target}, ${other}=default`, actual: `전체 로드: ${line(curr)}` }
  }
  const p = prev.slots[other]
  const c = curr.slots[other]
  const checks = [
    curr.slots[owner].screen === target,
    c.screen === p.screen,
    c.mountId === p.mountId,
    c.memo === p.memo,
  ]
  return {
    isMatched: checks.every(Boolean),
    expected: `${viaAnchor ? '(일반 <a> 이동) ' : ''}${owner}만 ${target}으로 바뀌고 ${other}는 화면 ${p.screen}, 인스턴스 #${p.mountId}, 메모 "${p.memo}" 유지`,
    actual: `이동 후 ${line(curr)}, ${other} 메모 "${c.memo}"\n이동 전 ${line(prev)}`,
  }
}
