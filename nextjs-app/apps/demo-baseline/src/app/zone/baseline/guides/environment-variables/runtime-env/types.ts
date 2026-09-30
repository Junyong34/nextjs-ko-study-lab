// 실습에서 조회할 수 있는 변수 이름. Route Handler가 임의 키를 읽지 못하도록 화이트리스트로 고정한다.
export const ENV_NAMES = ['NEXT_PUBLIC_STORE_NAME', 'INTERNAL_ADMIN_EMAIL', 'NODE_ENV'] as const
export type EnvName = (typeof ENV_NAMES)[number]

export type EnvValues = Record<EnvName, string | null>

/** 서버(Route Handler 또는 서버 컴포넌트 렌더)가 요청 시점에 process.env를 읽은 결과 */
export interface EnvSnapshot {
  source: 'route-handler' | 'server-render'
  values: EnvValues
  pid: number
  evaluatedAt: string
  /** Route Handler 모듈이 살아 있는 동안 실행된 횟수. 서버 렌더 스냅샷에서는 0 */
  requestCount: number
}

/** [변수 읽기] 한 번의 결과: 서버 조회 + 같은 순간의 브라우저 조회 */
export interface EnvReadResult {
  name: EnvName
  server: EnvSnapshot
  browserLiteral: string | null
  browserDynamic: string | null
}

export type Prediction = 'same' | 'different'
