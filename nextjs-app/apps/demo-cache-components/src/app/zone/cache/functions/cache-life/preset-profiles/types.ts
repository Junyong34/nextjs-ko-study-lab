/** 이 실습에서 실측하는 내장 프리셋 이름 */
export type PresetName = 'seconds' | 'minutes' | 'hours' | 'max'

export interface PresetSpec {
  name: PresetName
  /** 초 단위 */
  stale: number
  revalidate: number
  expire: number
  useCase: string
}

/**
 * 내장 프리셋 값 (단위: 초).
 * 출처: node_modules/next/dist/server/config-shared.js 의 defaultConfig.cacheLife (next 16.3.2)
 *      node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cacheLife.md "Preset cache profiles" 표
 * 이 앱의 next.config.ts는 cacheLife를 재정의하지 않으므로 위 기본값이 그대로 적용된다.
 */
export const PRESET_SPECS: PresetSpec[] = [
  { name: 'seconds', stale: 30, revalidate: 1, expire: 60, useCase: '실시간 데이터 (주가, 경기 점수)' },
  { name: 'minutes', stale: 300, revalidate: 60, expire: 3600, useCase: '자주 바뀌는 콘텐츠 (피드, 뉴스)' },
  { name: 'hours', stale: 300, revalidate: 3600, expire: 86400, useCase: '하루 여러 번 갱신 (재고, 날씨)' },
  { name: 'max', stale: 300, revalidate: 2592000, expire: 31536000, useCase: '거의 바뀌지 않음 (약관, 아카이브)' },
]

/** 'use cache' 함수 본문이 실제로 실행될 때 기록한 값. 캐시 HIT이면 이전 실행의 값이 그대로 온다. */
export interface CacheSnapshot {
  preset: PresetName
  cacheId: string
  /** 본문 실행 시각 (서버 epoch ms) */
  generatedAt: number
  /** 서버 프로세스에서 이 함수 본문이 실행된 횟수 */
  execNo: number
}

/** 한 번의 서버 요청에서 관측한 값 */
export interface RequestSnapshot {
  requestId: string
  /** 네 캐시 함수를 모두 await한 뒤의 서버 시각 (epoch ms) */
  requestAt: number
  mode: string
  rows: Record<PresetName, CacheSnapshot>
}

export interface Observation extends RequestSnapshot {
  seq: number
}

export function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}초`
  if (sec < 3600) return `${sec / 60}분`
  if (sec < 86400) return `${sec / 3600}시간`
  if (sec < 31536000) return `${sec / 86400}일`
  return `${sec / 31536000}년`
}

export function formatAge(ms: number): string {
  const s = ms / 1000
  return s < 60 ? `${s.toFixed(1)}초` : `${Math.floor(s / 60)}분 ${Math.round(s % 60)}초`
}

export function formatServerTime(epochMs: number): string {
  return new Date(epochMs).toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: false,
  })
}
