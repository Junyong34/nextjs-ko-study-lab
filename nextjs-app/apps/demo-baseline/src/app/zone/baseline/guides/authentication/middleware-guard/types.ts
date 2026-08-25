export interface AuthCookieState {
  hasAuth: boolean
  token: string | null
  user: {
    name: string
    role: 'admin' | 'guest' | 'user'
  } | null
}

export interface RouteGuardTestResult {
  path: string
  status: 200 | 307
  decision: 'ALLOWED' | 'REDIRECTED'
  redirectUrl?: string
  reason: string
  timestamp: string
}
