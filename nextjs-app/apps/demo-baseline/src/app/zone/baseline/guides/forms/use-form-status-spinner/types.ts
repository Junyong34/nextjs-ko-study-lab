export type OrderInput = { requestId: string; productId: string; quantity: string }
export type OrderResult = {
  status: 'success' | 'error'
  input: OrderInput
  errors: { quantity?: string; productId?: string; requestId?: string }
}
export type Observation = {
  pending: boolean
  disabled: boolean
  outsidePending: boolean
  input: OrderInput | null
}
export type Attempt = { input: OrderInput; observations: Observation[] }
