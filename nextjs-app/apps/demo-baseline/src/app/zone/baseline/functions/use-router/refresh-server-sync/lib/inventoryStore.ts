/**
 * 이 데모 전용 서버 메모리 재고 저장소.
 * dev 서버 프로세스가 살아있는 동안 유지되는 실제 값이며, 요청마다 초기화되는 mock이 아니다.
 */
const INITIAL_STOCK = 8

let currentStock = INITIAL_STOCK

/** Server Component가 렌더링할 때마다 호출해 "이번 렌더링에 반영된" 재고 값을 읽는다. */
export function getCurrentStock(): number {
  return currentStock
}

/** 다른 사용자가 방금 이 상품을 구매했다고 가정하고 서버 재고를 실제로 1개 줄인다. */
export function sellOneUnit(): number {
  currentStock = Math.max(0, currentStock - 1)
  return currentStock
}

/** 재고를 데모 시작 시점 값으로 되돌린다. */
export function restockToInitial(): number {
  currentStock = INITIAL_STOCK
  return currentStock
}
