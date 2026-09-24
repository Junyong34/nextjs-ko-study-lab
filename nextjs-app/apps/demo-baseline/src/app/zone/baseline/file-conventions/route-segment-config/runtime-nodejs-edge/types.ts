/** 세 Route Handler 하위 경로. 폴더 이름이 곧 fetch 경로다. */
export type ProbeSegment = 'default' | 'node' | 'edge'

/** 각 Route Handler가 파일 상단에 선언한 runtime export (default는 선언 없음). */
export const SEGMENT_DECLARATION: Record<ProbeSegment, string> = {
  default: '// runtime export 없음 (기본값)',
  node: "export const runtime = 'nodejs'",
  edge: "export const runtime = 'edge'",
}

export const PROBE_SEGMENTS: ProbeSegment[] = ['default', 'node', 'edge']

/**
 * probe.ts의 collectRuntimeProbe()가 실행된 환경에서 직접 읽어 온 값.
 * 세 Route Handler 모두 같은 함수를 호출하므로 값의 차이는 오직 runtime 설정에서 온다.
 */
export interface RuntimeProbe {
  /** process.env.NEXT_RUNTIME — Next.js가 실행 환경에 주입하는 식별자 */
  nextRuntime: string | null
  /** typeof globalThis.EdgeRuntime — Edge 샌드박스에만 정의되는 전역 */
  edgeRuntimeGlobal: string
  /** globalThis.process?.versions?.node — Node.js 프로세스 버전 */
  nodeVersion: string | null
  /** getBuiltinModule('node:fs')로 실제 파일 시스템 접근을 시도한 결과 */
  fsAccess: string
  /** 두 런타임 공통 Web API — 차이가 나지 않아야 하는 대조군 */
  webApis: string
  /** 응답이 캐시가 아니라 요청마다 새로 만들어졌는지 확인하는 서버 측 시각 */
  measuredAt: string
}

export type ProbeResult =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; httpStatus: number; data: RuntimeProbe }
