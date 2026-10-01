// 선언한 키(next.config env)와 선언하지 않은 대조 키. 이름만 보면 둘 다 NEXT_PUBLIC_ 접두사가 없다.
export const DECLARED_KEY = 'DEMO_ENVFIELD_BUILD_LABEL'
export const UNDECLARED_KEY = 'DEMO_ENVFIELD_UNDECLARED'

export type ProbeKey = typeof DECLARED_KEY | typeof UNDECLARED_KEY

/** 한 키를 점 접근(process.env.KEY)과 동적 접근(process.env[key])으로 각각 읽은 값 */
export interface AccessReading {
  key: ProbeKey
  dot: string | null
  dynamic: string | null
}

export interface ServerRead {
  readings: AccessReading[]
  pid: number
  evaluatedAt: string
}

/** 브라우저가 이미 내려받은 클라이언트 JS 청크를 다시 fetch해 값을 검색한 결과 */
export interface ChunkScan {
  scannedFiles: number
  /** 선언한 값이 문자열 리터럴로 들어 있는 청크 파일 이름 */
  filesWithValue: string[]
  /** `process.env.DEMO_ENVFIELD_BUILD_LABEL` 식별자가 치환되지 않고 남은 청크 파일 이름 */
  filesWithRawIdentifier: string[]
  failedFiles: number
}
