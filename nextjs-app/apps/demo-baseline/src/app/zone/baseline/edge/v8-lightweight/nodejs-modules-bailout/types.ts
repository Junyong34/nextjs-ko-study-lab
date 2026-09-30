export type ProbeTarget = 'existing' | 'missing'

/** ./node, ./edge Route Handler가 같은 형태로 돌려주는 fs 접근 시도 결과 */
export interface FsProbe {
  /** 핸들러 안에서 읽은 process.env.NEXT_RUNTIME */
  nextRuntime: string | null
  /** typeof EdgeRuntime — edge 샌드박스에서만 'string' */
  edgeRuntimeGlobal: string
  /** 읽으려고 한 파일 (cwd 기준 상대 경로) */
  file: string
  /** node:fs를 불러오고 파일까지 읽었는가 */
  ok: boolean
  /** fs 모듈 자체를 불러오지 못했는가(= 런타임이 Node 모듈을 막음) */
  moduleBlocked: boolean
  bytes: number | null
  errorName: string | null
  errorMessage: string | null
  measuredAt: string
}

export type ProbeSegment = 'node' | 'edge'

export type ProbeResult =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; httpStatus: number; data: FsProbe }
  | { status: 'error'; message: string }
