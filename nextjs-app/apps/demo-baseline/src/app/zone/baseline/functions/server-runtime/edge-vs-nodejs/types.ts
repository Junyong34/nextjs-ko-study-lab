export type DeclaredRuntime = 'edge' | 'nodejs'

export interface NodeApiProbeResult {
  api: string
  ok: boolean
  value?: string
  errorMessage?: string
}

export interface RuntimeProbeResponse {
  declaredRuntime: DeclaredRuntime
  runtimeEnv: string | null
  nodeApiProbes: NodeApiProbeResult[]
  receivedAt: string
}

export interface RuntimeCheckState {
  edge: RuntimeProbeResponse | null
  nodejs: RuntimeProbeResponse | null
}
