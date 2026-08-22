export interface FormState {
  success: boolean
  message: string
  fieldErrors?: {
    email?: string
    amount?: string
  }
}
