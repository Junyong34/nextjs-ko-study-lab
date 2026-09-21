export interface StatePreservationBaseline {
  query: string
  pathname: string
  category: string
  mountId: string
}

export interface StatePreservationSnapshot {
  mountId: string
  pathname: string
  query: string
  reportedPathname: string | null
  reportedCategory: string | null
}

export interface StatePreservationVerification {
  isMatched: boolean | undefined
  reason: string
}
