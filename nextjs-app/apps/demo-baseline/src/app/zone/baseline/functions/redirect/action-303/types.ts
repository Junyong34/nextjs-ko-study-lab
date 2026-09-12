export interface OrderInput {
  productId: string
  quantity: number
}

export interface Receipt extends OrderInput {
  receiptId: string
  issuedAt: number
}

export interface ReceiptResult {
  receipt: Receipt | null
  error: string | null
}

export interface OrderActionState {
  error: string | null
}
