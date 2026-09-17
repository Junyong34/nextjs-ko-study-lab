export type SessionRole = 'customer' | 'vip' | 'admin'

export interface SessionCookieState {
  role: string | null
  hasSessionToken: boolean
  sessionTokenPreview: string | null
}

export interface ClientCookieVisibility {
  sessionTokenVisible: boolean
  userRoleVisible: boolean
}
