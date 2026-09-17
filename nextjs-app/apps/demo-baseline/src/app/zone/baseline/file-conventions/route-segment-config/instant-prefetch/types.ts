export type ProbeCase = 'normal' | 'rsc-prefetch'

export interface ProbeResult {
  id: number
  probeCase: ProbeCase
  status: number
  redirected: boolean
  contentType: string | null
  vary: string | null
  fetchedAt: string
}
