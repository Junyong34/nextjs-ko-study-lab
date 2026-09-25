/** 이 실습에서 학습자가 지금 서 있는 위치 3곳. */
export type GroupId = 'index' | 'shop' | 'admin'

/**
 * BOOT_ID 생존 여부로 측정한 "문서 전체 리로드 vs 소프트 내비게이션" 판정 결과.
 * survivedNavigation === null 은 "아직 그룹 간 이동을 비교할 대상이 없다"는 뜻이다
 * (최초 진입, 또는 같은 그룹 안에서만 머무른 경우).
 */
export interface BootProbeResult {
  currentBootId: string
  previousBootId: string | null
  previousGroup: GroupId | null
  currentGroup: GroupId
  crossedGroup: boolean
  survivedNavigation: boolean | null
}
