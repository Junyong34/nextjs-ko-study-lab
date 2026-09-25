import type { BootProbeResult, GroupId } from '../types'

const STORAGE_BOOT_KEY = 'shop-vs-admin-roots:last-boot-id'
const STORAGE_GROUP_KEY = 'shop-vs-admin-roots:last-group'

/**
 * 이 브라우저 탭의 JS 힙이 한 번도 통째로 버려지지 않았다는 것을 증명하는 모듈 싱글톤 값이다.
 *
 * 이 상수는 모듈이 "처음 평가되는 순간" 딱 한 번만 계산된다.
 * - 실제 문서 전체 리로드(풀 페이지 리로드)가 일어나면 브라우저가 이전 JS 힙을 통째로 버리고
 *   모든 모듈을 처음부터 다시 평가하므로, 이 값도 매번 새로 생성된다.
 * - Next.js 라우터의 소프트(클라이언트 사이드) 내비게이션은 문서를 다시 로드하지 않고
 *   기존 JS 실행 컨텍스트를 그대로 재사용하므로, 이 값은 페이지를 몇 번을 이동해도 그대로 남는다.
 *
 * 즉 "직전에 기록해 둔 BOOT_ID"와 "지금 이 값"이 같은지 비교하면,
 * 방금 일어난 이동이 전체 리로드였는지 소프트 내비게이션이었는지를 실제로 판별할 수 있다.
 */
export const BOOT_ID =
  typeof window !== 'undefined'
    ? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
    : 'server'

/**
 * sessionStorage에 남아 있는 "직전 BOOT_ID / 직전 그룹"과 지금 값을 비교해 기록을 갱신한다.
 * 호출부(훅)가 컴포넌트 마운트당 정확히 한 번만 호출하도록 보장해야 한다
 * (React Strict Mode의 effect 이중 실행으로 인한 오염 방지 책임은 호출부에 있다).
 */
export function probeAndRecordBoot(currentGroup: GroupId): BootProbeResult {
  if (typeof window === 'undefined') {
    return {
      currentBootId: BOOT_ID,
      previousBootId: null,
      previousGroup: null,
      currentGroup,
      crossedGroup: false,
      survivedNavigation: null,
    }
  }

  const previousBootId = window.sessionStorage.getItem(STORAGE_BOOT_KEY)
  const previousGroup = window.sessionStorage.getItem(STORAGE_GROUP_KEY) as GroupId | null
  const crossedGroup = previousGroup !== null && previousGroup !== currentGroup

  window.sessionStorage.setItem(STORAGE_BOOT_KEY, BOOT_ID)
  window.sessionStorage.setItem(STORAGE_GROUP_KEY, currentGroup)

  return {
    currentBootId: BOOT_ID,
    previousBootId,
    previousGroup,
    currentGroup,
    crossedGroup,
    survivedNavigation: crossedGroup ? previousBootId === BOOT_ID : null,
  }
}

/** DemoResetButton에서 사용: 측정 기록을 지우고 진짜 새 탭처럼 되돌린다. */
export function clearBootProbeRecord(): void {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(STORAGE_BOOT_KEY)
  window.sessionStorage.removeItem(STORAGE_GROUP_KEY)
}
