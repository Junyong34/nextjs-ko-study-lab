import { cacheLife } from 'next/cache'
import type { CacheSnapshot, PresetName } from './types'

// 서버 프로세스 메모리의 실제 실행 카운터. 'use cache' 본문이 "실제로 실행될 때만" 증가한다.
const execCount: Record<PresetName, number> = { seconds: 0, minutes: 0, hours: 0, max: 0 }

function snapshot(preset: PresetName): CacheSnapshot {
  execCount[preset] += 1
  return {
    preset,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: Date.now(),
    execNo: execCount[preset],
  }
}

// 공식 문서 권장대로 cacheLife는 각 캐시 스코프 안에서 직접 호출한다 (공통 유틸로 감싸지 않음).

export async function getSecondsSnapshot(): Promise<CacheSnapshot> {
  'use cache'
  cacheLife('seconds')
  return snapshot('seconds')
}

export async function getMinutesSnapshot(): Promise<CacheSnapshot> {
  'use cache'
  cacheLife('minutes')
  return snapshot('minutes')
}

export async function getHoursSnapshot(): Promise<CacheSnapshot> {
  'use cache'
  cacheLife('hours')
  return snapshot('hours')
}

export async function getMaxSnapshot(): Promise<CacheSnapshot> {
  'use cache'
  cacheLife('max')
  return snapshot('max')
}
