export interface UserSession {
  isLoggedIn: boolean
  userId?: string
  userName?: string
  role?: 'customer' | 'admin'
  token?: string
}
