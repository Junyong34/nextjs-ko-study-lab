import type { RuntimeProbe } from './types'

/**
 * default/node/edge 세 Route Handler가 똑같이 호출하는 측정 함수.
 * node:fs 등을 정적 import하지 않는다 — 그러면 edge 번들이 빌드 단계에서 막혀
 * "같은 코드가 다른 환경에서 실행되는" 대조가 성립하지 않는다.
 * 대신 실행 시점에 전역 객체를 직접 조사한다.
 */
type MaybeNodeProcess = {
  env?: Record<string, string | undefined>
  versions?: { node?: string }
  getBuiltinModule?: (id: string) => unknown
  cwd?: () => string
}

type FsLike = { existsSync?: (path: string) => boolean }

function probeFs(proc: MaybeNodeProcess | undefined): string {
  if (typeof proc?.getBuiltinModule !== 'function') {
    return 'unavailable: process.getBuiltinModule 없음'
  }
  try {
    const fs = proc.getBuiltinModule('node:fs') as FsLike | undefined
    const cwd = typeof proc.cwd === 'function' ? proc.cwd() : '.'
    const exists = fs?.existsSync?.(cwd)
    return exists === true ? 'ok: fs.existsSync(process.cwd()) === true' : `unexpected: ${String(exists)}`
  } catch (error) {
    return `threw: ${error instanceof Error ? error.message : String(error)}`
  }
}

export function collectRuntimeProbe(): RuntimeProbe {
  const g = globalThis as typeof globalThis & { EdgeRuntime?: unknown; process?: MaybeNodeProcess }
  const proc = g.process

  const webApis = [
    `fetch:${typeof g.fetch}`,
    `Response:${typeof g.Response}`,
    `crypto.subtle:${typeof g.crypto?.subtle}`,
  ].join(', ')

  return {
    nextRuntime: process.env.NEXT_RUNTIME ?? null,
    edgeRuntimeGlobal: typeof g.EdgeRuntime,
    nodeVersion: proc?.versions?.node ?? null,
    fsAccess: probeFs(proc),
    webApis,
    measuredAt: new Date().toISOString(),
  }
}
