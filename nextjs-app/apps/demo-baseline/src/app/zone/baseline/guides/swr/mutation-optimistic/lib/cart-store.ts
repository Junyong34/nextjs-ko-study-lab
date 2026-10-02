import type { Cart, CartItem, ServerLogEntry } from '../types'

// 서버 메모리 저장소. dev 서버의 모듈 재평가에도 요청 간 값이 유지되도록 데모 접두사 키로 globalThis에 둔다.
const STORE_KEY = '__guidesSwrMutationOptimisticStore'

interface Store {
  items: CartItem[]
  version: number
  requestNo: number
  log: ServerLogEntry[]
}

const INITIAL_ITEMS: CartItem[] = [
  { id: 'tumbler', name: '스테인리스 진공 텀블러', price: 25000, qty: 2, stock: 3 },
  { id: 'mouse', name: '인체공학 무선 마우스', price: 99000, qty: 1, stock: 10 },
]

const MAX_LOG = 40

function fresh(): Store {
  return { items: INITIAL_ITEMS.map((i) => ({ ...i })), version: 1, requestNo: 0, log: [] }
}

function store(): Store {
  const g = globalThis as typeof globalThis & { [STORE_KEY]?: Store }
  g[STORE_KEY] ??= fresh()
  return g[STORE_KEY]
}

export function logRequest(method: ServerLogEntry['method'], detail: string): number {
  const s = store()
  s.requestNo += 1
  s.log = [...s.log, { no: s.requestNo, method, at: Date.now(), detail }].slice(-MAX_LOG)
  return s.requestNo
}

export function snapshot(requestNo: number): Cart {
  const s = store()
  return { items: s.items.map((i) => ({ ...i })), version: s.version, requestNo, servedAt: Date.now() }
}

/** 수량을 바꾸고 재고 범위(1~stock)로 잘라 확정한다. 확정 수량을 돌려준다. */
export function applyDelta(itemId: string, delta: number): number | null {
  const s = store()
  const item = s.items.find((i) => i.id === itemId)
  if (!item) return null
  item.qty = Math.min(item.stock, Math.max(1, item.qty + delta))
  s.version += 1
  return item.qty
}

export function readLog(): ServerLogEntry[] {
  return store().log
}

export function resetStore() {
  const g = globalThis as typeof globalThis & { [STORE_KEY]?: Store }
  g[STORE_KEY] = fresh()
}
