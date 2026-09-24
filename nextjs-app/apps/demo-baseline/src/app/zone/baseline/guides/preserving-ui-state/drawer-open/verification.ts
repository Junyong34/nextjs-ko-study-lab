import type {
  DrawerReport,
  DrawerReports,
  DrawerSlot,
  PlacementSnapshot,
  PlacementVerification,
  SlotExpectation,
  SlotVerdict,
} from './types'

export const BASE_PATH = '/zone/baseline/guides/preserving-ui-state/drawer-open'

export const SLOTS: DrawerSlot[] = ['layout', 'keyed', 'page']

export const SLOT_LABELS: Record<DrawerSlot, string> = {
  layout: 'layout.tsx에 둔 Drawer',
  keyed: 'layout.tsx + key={pathname} Drawer',
  page: 'page.tsx에 둔 Drawer',
}

/** 가이드 기준 기대 동작: 공유 layout은 보존, key 변경·page 소유는 새 인스턴스로 초기화 */
export const SLOT_EXPECTATIONS: Record<DrawerSlot, SlotExpectation> = {
  layout: 'preserve',
  keyed: 'reset',
  page: 'reset',
}

/** 세 Drawer가 모두 현재 경로에서 보고했으면 그 묶음을, 아니면 null을 돌려준다. */
export function collectDrawers(
  reports: DrawerReports,
  pathname: string,
): Record<DrawerSlot, DrawerReport> | null {
  const drawers = {} as Record<DrawerSlot, DrawerReport>
  for (const slot of SLOTS) {
    const report = reports[slot]
    if (!report || !report.mountId || report.pathname !== pathname) return null
    drawers[slot] = report
  }
  return drawers
}

/** 이동 전 기록은 세 Drawer 모두 열려 있고 메모가 있어야 의미가 있다(초기값과 구분하기 위해). */
export function canRecordBefore(drawers: Record<DrawerSlot, DrawerReport> | null): boolean {
  if (!drawers) return false
  return SLOTS.every((slot) => drawers[slot].open && drawers[slot].memo.trim() !== '')
}

function describe(report: DrawerReport) {
  return `mount ${report.mountId.slice(0, 6)} · ${report.open ? '열림' : '닫힘'} · 메모 "${report.memo}" · scroll ${report.scrollTop}px`
}

export function judgeSlot(slot: DrawerSlot, before: DrawerReport, after: DrawerReport): SlotVerdict {
  const expectation = SLOT_EXPECTATIONS[slot]
  const sameMount = before.mountId === after.mountId
  if (expectation === 'preserve') {
    const ok =
      sameMount &&
      after.open === before.open &&
      after.memo === before.memo &&
      Math.abs(after.scrollTop - before.scrollTop) <= 1
    return {
      slot,
      expectation,
      ok,
      detail: ok
        ? '같은 인스턴스 유지 — 열림·메모·스크롤 모두 보존'
        : `보존 기대와 다름 (${sameMount ? '같은 mount' : '리마운트됨'}) → ${describe(after)}`,
    }
  }
  const ok = !sameMount && !after.open && after.memo === '' && after.scrollTop === 0
  return {
    slot,
    expectation,
    ok,
    detail: ok
      ? '새 인스턴스로 교체 — 닫힘·빈 메모·scroll 0 초기값'
      : `초기화 기대와 다름 (${sameMount ? '같은 mount 유지' : '리마운트됨'}) → ${describe(after)}`,
  }
}

export function verifyPlacement(
  before: PlacementSnapshot | null,
  after: PlacementSnapshot | null,
): PlacementVerification {
  if (!before) {
    return {
      isMatched: undefined,
      reason: '세 Drawer를 모두 열고 메모를 입력한 뒤 [이동 전 상태 기록]을 눌러주세요.',
      slots: [],
    }
  }
  if (!after) {
    return {
      isMatched: undefined,
      reason: `기록 완료(${before.pathname}). 이제 다른 카테고리 링크로 이동하세요.`,
      slots: [],
    }
  }
  if (after.pathname === before.pathname) {
    return { isMatched: undefined, reason: '아직 다른 경로로 이동하지 않았습니다.', slots: [] }
  }
  if (after.timeOrigin !== before.timeOrigin) {
    return {
      isMatched: false,
      reason: '문서가 새로 로드되었습니다(performance.timeOrigin 변경). Link 클라이언트 이동이 아닙니다.',
      slots: [],
    }
  }
  const slots = SLOTS.map((slot) => judgeSlot(slot, before.drawers[slot], after.drawers[slot]))
  const failed = slots.filter((verdict) => !verdict.ok)
  return {
    isMatched: failed.length === 0,
    reason:
      failed.length === 0
        ? `${before.pathname} → ${after.pathname} 이동(문서 재로드 없음) 직후, layout Drawer만 보존되고 나머지 둘은 초기화되었습니다.`
        : `기대와 다른 배치: ${failed.map((verdict) => SLOT_LABELS[verdict.slot]).join(', ')}`,
    slots,
  }
}
