import type { Deal, DealsSnapshot, DealsVariant, ReadSource, ServerRead } from '../types'

// 서버 전용 데이터 읽기. 서버 컴포넌트의 prefetch와 api/deals Route Handler가 같은 함수를 쓴다.
// 읽기 기록은 데모 접두사 키로 globalThis에 둔다(요청 간 유지).
const STORE_KEY = '__guidesTanstackSsrHydrationStore'
const READ_DELAY_MS = 400
const MAX_READS = 30

const DEALS: Deal[] = [
  { id: 'd1', name: '노이즈캔슬링 헤드폰', price: 329000, discount: 18 },
  { id: 'd2', name: '4K 웹캠', price: 149000, discount: 25 },
  { id: 'd3', name: '저소음 무선 키보드', price: 89000, discount: 12 },
  { id: 'd4', name: '스탠딩 데스크 프레임', price: 412000, discount: 30 },
]

interface Store {
  readNo: number
  reads: ServerRead[]
}

function store(): Store {
  const g = globalThis as typeof globalThis & { [STORE_KEY]?: Store }
  g[STORE_KEY] ??= { readNo: 0, reads: [] }
  return g[STORE_KEY]
}

export async function getDeals(source: ReadSource, variant: DealsVariant): Promise<DealsSnapshot> {
  const s = store()
  s.readNo += 1
  const no = s.readNo
  s.reads = [...s.reads, { no, source, variant, at: Date.now() }].slice(-MAX_READS)
  await new Promise((r) => setTimeout(r, READ_DELAY_MS))
  return { items: DEALS, source, readNo: no, fetchedAt: Date.now() }
}

export function readServerReads(): ServerRead[] {
  return store().reads
}

export function resetServerReads() {
  const g = globalThis as typeof globalThis & { [STORE_KEY]?: Store }
  g[STORE_KEY] = { readNo: 0, reads: [] }
}
