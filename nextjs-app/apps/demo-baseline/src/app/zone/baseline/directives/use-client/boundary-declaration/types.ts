export type AttemptStatus = 'idle' | 'success' | 'error'

export interface AttemptResult {
  status: AttemptStatus
  detail: string
}

export interface BoundaryState {
  serverAttempt: AttemptResult
  clientAttempt: AttemptResult
  leafAttempt: AttemptResult
  setServerAttempt: (result: AttemptResult) => void
  setClientAttempt: (result: AttemptResult) => void
  setLeafAttempt: (result: AttemptResult) => void
  reset: () => void
}
