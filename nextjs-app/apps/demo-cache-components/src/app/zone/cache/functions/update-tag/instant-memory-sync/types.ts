export interface CartQtySnapshot {
  qty: number
  cacheId: string
  generatedAt: string
}

export type CartSyncMode = 'updateTag' | 'revalidateTag'

export interface CartQtyActionResult {
  mode: CartSyncMode
  tag: string
  qty: number
  timestamp: string
}
