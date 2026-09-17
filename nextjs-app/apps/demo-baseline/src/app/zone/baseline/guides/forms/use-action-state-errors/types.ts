export type OrderFields = { email: string; quantity: string }
export type FieldErrors = { email?: string; quantity?: string }
export type FormState = {
  status: 'idle' | 'error' | 'success'
  fields: OrderFields | null
  errors: FieldErrors
  data: { email: string; quantity: number } | null
}
export type ExpectedScenario = 'both-errors' | 'email-error' | 'quantity-error' | 'success'
