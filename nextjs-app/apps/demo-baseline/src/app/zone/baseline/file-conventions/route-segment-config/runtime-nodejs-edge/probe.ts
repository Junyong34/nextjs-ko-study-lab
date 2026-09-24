import type { RuntimeProbe } from './types'

/**
 * default/node/edge 세 Route Handler가 똑같이 호출하는 측정 함수.
 * node:* 모듈을 import하지도, Node API를 호출하지도 않는다 — edge 세그먼트의 번들에 Node 모듈
 * 참조가 섞이면 Vercel의 Edge Function 빌드가 배포를 거부한다(edge-vs-nodejs 예제의 d9425cc 수정 참고).
 * 대신 Node.js 전용 전역(process.version, process.platform)의 존재 여부를 typeof로만 조사한다.
 */
type MaybeNodeProcess = {
  env?: Record<string, string | undefined>
  version?: unknown
  platform?: unknown
  versions?: { node?: string }
}

export function collectRuntimeProbe(): RuntimeProbe {
  const g = globalThis as typeof globalThis & { EdgeRuntime?: unknown; process?: MaybeNodeProcess }
  const proc = g.process

  const webApis = [
    `fetch:${typeof g.fetch}`,
    `Response:${typeof g.Response}`,
    `crypto.subtle:${typeof g.crypto?.subtle}`,
  ].join(', ')

  const nodeGlobals = [`process.version:${typeof proc?.version}`, `process.platform:${typeof proc?.platform}`].join(
    ', ',
  )

  return {
    nextRuntime: process.env.NEXT_RUNTIME ?? null,
    edgeRuntimeGlobal: typeof g.EdgeRuntime,
    nodeVersion: proc?.versions?.node ?? null,
    nodeGlobals,
    webApis,
    measuredAt: new Date().toISOString(),
  }
}
