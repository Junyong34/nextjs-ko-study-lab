import { cacheLife, cacheTag } from 'next/cache'

export interface CachedPresetSnapshot {
  cacheId: string
  generatedAt: string
}

function createSnapshot(): CachedPresetSnapshot {
  return {
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    }),
  }
}

export async function getSecondsPresetSnapshot(): Promise<CachedPresetSnapshot> {
  'use cache'
  cacheTag('functions-cache-life-preset-profiles:seconds')
  cacheLife('seconds')
  return createSnapshot()
}

export async function getHoursPresetSnapshot(): Promise<CachedPresetSnapshot> {
  'use cache'
  cacheTag('functions-cache-life-preset-profiles:hours')
  cacheLife('hours')
  return createSnapshot()
}

export async function getMaxPresetSnapshot(): Promise<CachedPresetSnapshot> {
  'use cache'
  cacheTag('functions-cache-life-preset-profiles:max')
  cacheLife('max')
  return createSnapshot()
}
