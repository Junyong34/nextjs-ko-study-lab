import type { NodeApiProbeResult, RuntimeProbeResponse } from './types'

// 이 파일은 api/edge/route.ts에서만 쓴다. node:fs / node:crypto를 실제로 import하면
// (동적 import에 리터럴 문자열을 써도) Vercel의 Edge Function 빌드가 정적 분석으로
// 감지해 "referencing unsupported modules"로 배포 자체를 거부한다 — Turbopack의 로컬
// 에러 메시지와 달리 이건 런타임 실패가 아니라 배포 차단이라 이 파일에는 node: import를
// 절대 두지 않는다. 대신 Node.js 전용 전역(process.version, process.platform)의 존재 여부만으로
// 같은 사실(Edge Runtime에는 Node.js 전용 API가 없다)을 import 없이 실측한다.
function probeNodeOnlyGlobal(api: string, hasGlobal: () => boolean): NodeApiProbeResult {
  try {
    const present = hasGlobal()
    return present
      ? { api, ok: true, value: '이 런타임에도 존재함(Edge라면 예상과 다름)' }
      : { api, ok: false, errorMessage: `${api} — 이 런타임에는 존재하지 않음(ReferenceError 없이 typeof로 실측)` }
  } catch (error) {
    return { api, ok: false, errorMessage: error instanceof Error ? error.message : String(error) }
  }
}

export function buildEdgeRuntimeProbeResponse(): RuntimeProbeResponse {
  const nodeApiProbes = [
    probeNodeOnlyGlobal('typeof process.version === "string"', () => typeof process?.version === 'string'),
    probeNodeOnlyGlobal('typeof process.platform === "string"', () => typeof process?.platform === 'string'),
  ]

  return {
    declaredRuntime: 'edge',
    runtimeEnv: process.env.NEXT_RUNTIME ?? null,
    nodeApiProbes,
    receivedAt: new Date().toISOString(),
  }
}
