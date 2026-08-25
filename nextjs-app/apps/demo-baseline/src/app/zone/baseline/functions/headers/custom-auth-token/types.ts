export interface AuthHeaderCheckResult {
  status: 200 | 401
  tokenReceived: string | null
  userId?: string
  role?: string
  scope?: string[]
  error?: string
  headersList: Array<{ key: string; value: string }>
  timestamp: string
}
