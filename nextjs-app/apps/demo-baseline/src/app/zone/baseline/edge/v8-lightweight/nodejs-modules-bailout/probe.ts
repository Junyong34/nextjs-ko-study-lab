import type { FsProbe, ProbeTarget } from './types'

export const TARGET_FILES: Record<ProbeTarget, string> = {
  existing: 'package.json',
  missing: 'no-such-file.csv',
}

type FsLike = { readFileSync(path: string): { byteLength: number } }

/**
 * node/edge 두 Route Handler가 똑같이 호출하는 측정 함수.
 * 정적 `import fs from 'node:fs'`를 쓰지 않는 이유: edge 세그먼트 번들에 Node 내장 모듈 참조가
 * 들어가면 빌드 단계에서 경고/배포 거부가 나 앱 전체가 영향을 받는다. 그래서 specifier를 변수로 두고
 * 번들러 분석을 끈 동적 import로, "실행 시점에 그 런타임이 fs를 주는가"만 실제로 시도한다.
 */
export async function probeFs(target: ProbeTarget): Promise<FsProbe> {
  const file = TARGET_FILES[target]
  const base = {
    nextRuntime: process.env.NEXT_RUNTIME ?? null,
    edgeRuntimeGlobal: typeof (globalThis as { EdgeRuntime?: unknown }).EdgeRuntime,
    file,
    measuredAt: new Date().toISOString(),
  }

  const specifier = 'node:fs'
  let fs: FsLike
  try {
    const mod = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ specifier)
    fs = (mod.default ?? mod) as FsLike
  } catch (error) {
    return { ...base, ok: false, moduleBlocked: true, bytes: null, ...describe(error) }
  }

  try {
    const bytes = fs.readFileSync(file).byteLength
    return { ...base, ok: true, moduleBlocked: false, bytes, errorName: null, errorMessage: null }
  } catch (error) {
    return { ...base, ok: false, moduleBlocked: false, bytes: null, ...describe(error) }
  }
}

function describe(error: unknown) {
  if (error instanceof Error) {
    return { errorName: error.name, errorMessage: error.message.split('\n')[0].slice(0, 200) }
  }
  return { errorName: 'Unknown', errorMessage: String(error).slice(0, 200) }
}

export function parseTarget(request: Request): ProbeTarget {
  return new URL(request.url).searchParams.get('target') === 'missing' ? 'missing' : 'existing'
}
