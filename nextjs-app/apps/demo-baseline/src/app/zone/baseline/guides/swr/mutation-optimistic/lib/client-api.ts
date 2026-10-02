import type { Cart, LabEvent, PatchInput, ServerLog } from '../types'

const BASE = '/zone/baseline/guides/swr/mutation-optimistic'

/** useSWR 캐시 키. 모든 구독 컴포넌트와 mutate()가 이 문자열 하나로 같은 캐시 칸을 가리킨다. */
export const CART_KEY = `${BASE}/api/cart`
const LOG_URL = `${BASE}/api/log`

export type Recorder = (e: Omit<LabEvent, 'seq' | 't'>) => void

export const qtyOf = (cart: Cart | undefined, itemId: string) => cart?.items.find((i) => i.id === itemId)?.qty

/** SWRConfig에 넣는 fetcher. 실제 fetch 시작·응답을 기록만 하고 값은 그대로 돌려준다. */
export function createFetcher(record: Recorder) {
  return async (url: string): Promise<Cart> => {
    record({ kind: 'fetch-start', detail: 'GET api/cart 시작' })
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) throw new Error(`GET ${res.status}`)
    const cart = (await res.json()) as Cart
    record({ kind: 'fetch-end', detail: `GET 응답 (서버 요청 #${cart.requestNo}, v${cart.version})` })
    return cart
  }
}

/** mutate()의 두 번째 인자로 넘기는 실제 쓰기 요청. 응답한 장바구니 전체가 populateCache로 캐시에 들어간다. */
export async function patchCart(input: PatchInput, record: Recorder): Promise<Cart> {
  record({ kind: 'patch-start', detail: `PATCH 전송 (${input.itemId} ${input.delta > 0 ? '+1' : '-1'})` })
  const res = await fetch(CART_KEY, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    record({ kind: 'patch-fail', detail: `PATCH 응답 ${res.status} — ${body.error ?? '실패'}` })
    throw new Error(`PATCH ${res.status}`)
  }
  const cart = (await res.json()) as Cart
  record({ kind: 'patch-ok', detail: `PATCH 응답 200 (서버 확정 수량 ${qtyOf(cart, input.itemId)})`, serverQty: qtyOf(cart, input.itemId) })
  return cart
}

export async function readServerLog(): Promise<ServerLog> {
  const res = await fetch(LOG_URL, { cache: 'no-store' })
  return (await res.json()) as ServerLog
}

export async function resetServerCart() {
  await fetch(CART_KEY, { method: 'DELETE' })
}
