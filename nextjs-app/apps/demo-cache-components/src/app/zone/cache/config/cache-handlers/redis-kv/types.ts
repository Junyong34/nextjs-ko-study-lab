// 이 데모의 Route Handler 경로. 셸 안(iframe)에서도 같은 상대 경로로 cache zone에 도달한다.
export const PROBE_PATH = '/zone/cache/config/cache-handlers/redis-kv/probe'

/** 'use cache' 함수가 실제로 실행됐을 때만 새로 만들어지는 값 */
export interface CachedSnapshot {
  cacheId: string
  /** 함수 본문이 실행된 서버 시각 (epoch ms). 캐시가 재사용되면 과거 값이 그대로 나온다. */
  generatedAt: number
  /** 함수 본문을 실행한 Node.js 프로세스의 PID */
  generatedByPid: number
}

/** 이 응답을 처리한 Node.js 프로세스 정보 (캐시 밖에서 매 요청 측정) */
export interface ServerInstance {
  pid: number
  /** process.uptime()으로 역산한 프로세스 시작 시각 (epoch ms) */
  startedAt: number
  nodeEnv: string
}

export type ProbeBody =
  | { ok: true; op: 'read'; snapshot: CachedSnapshot; instance: ServerInstance; servedAt: number }
  | { ok: true; op: 'invalidate'; tag: string; instance: ServerInstance; servedAt: number }
  | { ok: false; error: string }

/** 화면 기록 한 줄. kind로 읽기와 무효화를 구분한다. */
export type ProbeRecord =
  | {
      seq: number
      kind: 'read'
      snapshot: CachedSnapshot
      instance: ServerInstance
      servedAt: number
      /** 직전 읽기 이후 무효화가 없었는데 cacheId가 같으면 hit */
      phase: 'first' | 'hit' | 'recomputed'
    }
  | { seq: number; kind: 'invalidate'; tag: string; instance: ServerInstance; servedAt: number }
