export interface CookieObservation {
  present: boolean
  isDemoMember: boolean
  checkedAt: string
}

export interface CookieHistory {
  created: boolean
  deleted: boolean
}

export type CookieOperation = 'create' | 'delete' | 'verify' | 'reset'
