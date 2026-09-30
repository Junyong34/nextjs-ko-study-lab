export type FetchMode = 'default' | 'force-cache' | 'no-store' | 'revalidate'

export const REVALIDATE_SECONDS = 10
export const FETCH_CACHE_TAG = 'demo-fetch-cache-legacy'

export interface FetchModeInfo {
  mode: FetchMode
  label: string
  code: string
  expect: string
}

export const FETCH_MODES: FetchModeInfo[] = [
  {
    mode: 'default',
    label: '옵션 없음',
    code: 'fetch(url)',
    expect: '캐시되지 않음: 호출마다 sourceCount 증가',
  },
  {
    mode: 'force-cache',
    label: 'force-cache',
    code: "fetch(url, { cache: 'force-cache' })",
    expect: '첫 호출 이후 같은 sourceCount (무효화 전까지)',
  },
  {
    mode: 'no-store',
    label: 'no-store',
    code: "fetch(url, { cache: 'no-store' })",
    expect: '호출마다 sourceCount 증가',
  },
  {
    mode: 'revalidate',
    label: `revalidate ${REVALIDATE_SECONDS}초`,
    code: `fetch(url, { next: { revalidate: ${REVALIDATE_SECONDS} } })`,
    expect: `${REVALIDATE_SECONDS}초 안에는 같은 sourceCount`,
  },
]

export interface FetchProbeResult {
  mode: FetchMode
  sourceCount: number
  generatedAt: string
  /** 이 호출이 서버 액션에서 fetch를 끝내기까지 걸린 시간(ms) */
  elapsedMs: number
  /** 클라이언트가 호출한 시각(ms epoch) */
  calledAt: number
  /** 무효화(revalidateTag) 횟수 — 같은 epoch 안에서만 비교한다 */
  epoch: number
}
