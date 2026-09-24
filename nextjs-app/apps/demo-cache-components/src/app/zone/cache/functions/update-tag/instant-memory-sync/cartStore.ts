import type { LineId, SourceLine } from './types'
import { nowStamp } from './tags'

/**
 * 서버 프로세스 메모리에 있는 장바구니 원본(DB 역할).
 * 개발 모드 HMR로 모듈이 다시 평가돼도 값이 유지되도록 globalThis에 둔다.
 */
type CartStore = Record<LineId, SourceLine>

const KEY = Symbol.for('functions-update-tag-instant-memory-sync:cart-store')
const globalRef = globalThis as unknown as Record<symbol, CartStore | undefined>

function store(): CartStore {
  globalRef[KEY] ??= {
    update: { qty: 1, updatedAt: '초기값', updatedAtMs: 0 },
    revalidate: { qty: 1, updatedAt: '초기값', updatedAtMs: 0 },
  }
  return globalRef[KEY]
}

export function readSourceLine(lineId: LineId): SourceLine {
  return { ...store()[lineId] }
}

export function changeQty(lineId: LineId, delta: number): SourceLine {
  const current = store()[lineId]
  const at = nowStamp()
  const next = { qty: Math.min(99, Math.max(1, current.qty + delta)), updatedAt: at.label, updatedAtMs: at.ms }
  store()[lineId] = next
  return { ...next }
}
