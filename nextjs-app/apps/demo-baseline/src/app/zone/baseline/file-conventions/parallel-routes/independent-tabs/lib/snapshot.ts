import type { SlotName } from './constants'

export interface SlotState { screen: string; mountId: string; memo: string }
export interface Snapshot { pathname: string; slots: Record<SlotName, SlotState> }

const NAMES: SlotName[] = ['dashboard', 'metrics']

/** 실제 DOM에서 슬롯별 화면 식별값, 인스턴스 id, 메모 입력값을 읽는다. 준비 전이면 null. */
export function readSnapshot(root: HTMLElement): Snapshot | null {
  const slots = {} as Record<SlotName, SlotState>
  for (const name of NAMES) {
    const el = root.querySelector<HTMLElement>(`[data-slot-root="${name}"]`)
    const screen = el?.querySelector<HTMLElement>('[data-screen]')?.dataset.screen
    const mountId = el?.dataset.mountId
    if (!el || !screen || !mountId) return null
    slots[name] = { screen, mountId, memo: el.querySelector<HTMLInputElement>('input')?.value ?? '' }
  }
  return { pathname: window.location.pathname, slots }
}
