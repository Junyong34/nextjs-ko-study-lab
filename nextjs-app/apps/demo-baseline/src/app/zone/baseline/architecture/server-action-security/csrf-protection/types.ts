export interface CsrfProbeState {
  status: 'idle' | 'success' | 'error'
  message: string
  origin: string | null
  host: string | null
  forwardedHost: string | null
  reachedAction: boolean
}

export const INITIAL_CSRF_PROBE_STATE: CsrfProbeState = {
  status: 'idle',
  message: '아직 Server Action을 호출하지 않았습니다.',
  origin: null,
  host: null,
  forwardedHost: null,
  reachedAction: false,
}
