export interface StockActionResult {
  /** Server Action이 실행되는 순간 서버 메모리에 실제로 반영된 재고 값 */
  stock: number
  /** Server Action이 처리된 시각 (HH:MM:SS) */
  changedAt: string
}

export interface StockLogEntry {
  id: number
  message: string
  timestamp: string
}
