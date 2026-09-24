import type { Category, DbSnapshot, ProductRow } from './types'

/**
 * 모듈 메모리에 있는 가짜 DB. 테이블 자체는 in-memory지만 "쿼리가 실제로 실행됐는가"는
 * runQuery()가 호출될 때마다 올라가는 카운터로 실측한다.
 * dev의 HMR·번들 중복에도 한 인스턴스를 공유하도록 globalThis에 둔다.
 */
interface FakeDb {
  bootId: string
  table: ProductRow[]
  executions: number
}

const SEED: ProductRow[] = [
  { id: 'kb-01', name: '저소음 기계식 키보드', category: 'keyboard', price: 129000 },
  { id: 'kb-02', name: '로우프로파일 키보드', category: 'keyboard', price: 89000 },
  { id: 'ms-01', name: '무선 버티컬 마우스', category: 'mouse', price: 59000 },
  { id: 'ms-02', name: '게이밍 마우스', category: 'mouse', price: 79000 },
  { id: 'mn-01', name: '27형 QHD 모니터', category: 'monitor', price: 329000 },
]

const DB_KEY = Symbol.for('functions-unstable-cache-db-query:fake-db')

function db(): FakeDb {
  const g = globalThis as unknown as Record<symbol, FakeDb | undefined>
  if (!g[DB_KEY]) {
    g[DB_KEY] = {
      bootId: Math.random().toString(36).slice(2, 7).toUpperCase(),
      table: SEED.map((row) => ({ ...row })),
      executions: 0,
    }
  }
  return g[DB_KEY]
}

/** SELECT 실행: 카운터를 올리고 실행 기록과 결과 행을 돌려준다 */
export function runQuery(where: (row: ProductRow) => boolean) {
  const store = db()
  store.executions += 1
  return {
    runId: store.executions,
    bootId: store.bootId,
    executedAt: new Date(),
    rows: store.table.filter(where).map((row) => ({ ...row })),
  }
}

/** UPDATE 실행: 캐시와 무관하게 원본 테이블만 바꾼다 (캐시 무효화는 호출하지 않음) */
export function raiseFirstPrice(category: Category) {
  const row = db().table.find((r) => r.category === category)
  if (!row) throw new Error(`행이 없습니다: ${category}`)
  row.price += 1000
  return { productId: row.id, newPrice: row.price }
}

export function resetTable() {
  db().table = SEED.map((row) => ({ ...row }))
}

export function executionCount() {
  return db().executions
}

export function currentBootId() {
  return db().bootId
}

/** 캐시를 거치지 않는 원본 테이블 상태 (화면의 DB 패널용 — 쿼리 카운터는 올리지 않음) */
export function snapshot(): DbSnapshot {
  const store = db()
  return { rows: store.table.map((row) => ({ ...row })), executions: store.executions, bootId: store.bootId }
}
