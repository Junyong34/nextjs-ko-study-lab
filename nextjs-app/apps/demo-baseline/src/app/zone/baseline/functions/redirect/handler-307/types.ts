export type RequestMethod = 'POST' | 'GET'

export interface OrderInput {
  productId: string
  quantity: number
  requestId: string
}

export interface SubmittedOrder extends OrderInput {
  method: RequestMethod
}

export interface OrderReceipt extends OrderInput {
  method: string
  source: 'body' | 'query'
}

export interface RedirectObservation {
  status: number
  redirected: boolean
  url: string
  receipt: OrderReceipt | null
}

export interface RequestResult {
  submitted: SubmittedOrder
  observation: RedirectObservation | null
  isMatched: boolean
  reason: string
}
