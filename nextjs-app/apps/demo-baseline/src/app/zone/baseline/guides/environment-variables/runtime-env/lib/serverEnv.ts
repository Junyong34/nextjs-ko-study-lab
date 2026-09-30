import { ENV_NAMES, type EnvSnapshot, type EnvValues } from '../types'

/** process.env[name]는 정적 치환 대상이 아니므로 호출 시점의 실제 프로세스 환경을 읽는다. */
export function snapshotServerEnv(source: EnvSnapshot['source'], requestCount = 0): EnvSnapshot {
  const values = Object.fromEntries(ENV_NAMES.map((name) => [name, process.env[name] ?? null])) as EnvValues
  return { source, values, pid: process.pid, evaluatedAt: new Date().toISOString(), requestCount }
}
