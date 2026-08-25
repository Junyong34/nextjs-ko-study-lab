export interface RouteSegmentScope {
  path: string
  label: string
  isDirectTarget: boolean
  isNestedUnderLayout: boolean
  status: 'PURGED' | 'PRESERVED'
}

export interface ScopeRevalidateResult {
  scope: 'page' | 'layout'
  targetPath: string
  purgedCount: number
  segments: RouteSegmentScope[]
  timestamp: string
}
