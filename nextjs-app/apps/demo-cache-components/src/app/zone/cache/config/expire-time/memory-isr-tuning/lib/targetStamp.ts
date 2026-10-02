import { cacheLife, cacheTag } from 'next/cache'

// 대상 페이지가 캐시하는 값. 태그는 zone 전역이라 데모 접두사를 붙인다 (apps/AGENTS.md 8항).
// 두 함수는 cacheLife 프로필만 다르다. 경로의 Cache-Control은 이 프로필의 revalidate/expire에서 계산된다.

export async function readDefaultProfileStamp(): Promise<number> {
  'use cache'
  cacheTag('config-expire-time-memory-isr-tuning:default-profile')
  cacheLife('default')
  return Date.now()
}

export async function readHoursProfileStamp(): Promise<number> {
  'use cache'
  cacheTag('config-expire-time-memory-isr-tuning:hours-profile')
  cacheLife('hours')
  return Date.now()
}
