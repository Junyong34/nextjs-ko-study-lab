import { cacheLife, cacheTag } from 'next/cache'
import type { FaultKey, PresetKey } from './types'

export interface CachedEntry {
  cacheId: string
  /** 이 엔트리가 실제로 계산된 서버 시각 (epoch ms). 캐시가 재사용되면 과거 값이 그대로 나온다. */
  generatedAt: number
}

function createEntry(): CachedEntry {
  return { cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(), generatedAt: Date.now() }
}

// 세 함수의 본문은 같고 cacheLife에 넘기는 프리셋 이름만 다르다.
// 프리셋 값은 next.config.ts 최상위 cacheLife에 전역 선언되어 있다.

async function readShort(): Promise<CachedEntry> {
  'use cache'
  cacheTag('config-cache-life-custom-presets:short')
  cacheLife('config-cache-life-custom-presets:short')
  return createEntry()
}

async function readMedium(): Promise<CachedEntry> {
  'use cache'
  cacheTag('config-cache-life-custom-presets:medium')
  cacheLife('config-cache-life-custom-presets:medium')
  return createEntry()
}

async function readLong(): Promise<CachedEntry> {
  'use cache'
  cacheTag('config-cache-life-custom-presets:long')
  cacheLife('config-cache-life-custom-presets:long')
  return createEntry()
}

export const PRESET_READERS: Record<PresetKey, () => Promise<CachedEntry>> = {
  short: readShort,
  medium: readMedium,
  long: readLong,
}

// 아래 두 함수는 일부러 잘못 쓴 예다. 호출하면 Next.js가 cacheLife() 안에서 오류를 던진다.
// next.config.ts에 같은 잘못을 적으면 설정 로드 단계에서 서버 전체가 뜨지 않으므로, 실행 중인 데모에서는
// 같은 검증 함수(validateAndNormalizeCacheLifeProfile)를 거치는 인라인 객체로 재현한다.

async function readInvalidOrder(): Promise<CachedEntry> {
  'use cache'
  cacheLife({ revalidate: 60, expire: 30 })
  return createEntry()
}

async function readUnknownProfile(): Promise<CachedEntry> {
  'use cache'
  // next dev/build가 생성하는 타입(.next/types/cache-life.d.ts)은 선언한 프리셋 이름만 허용하므로 원래는 tsc에서 먼저 막힌다.
  // 실행 시 오류를 보여 주기 위해 타입 검사만 우회한다.
  const cacheLifeByName = cacheLife as (profile: string) => void
  cacheLifeByName('config-cache-life-custom-presets:unknown')
  return createEntry()
}

export const FAULT_READERS: Record<FaultKey, () => Promise<CachedEntry>> = {
  'invalid-order': readInvalidOrder,
  'unknown-profile': readUnknownProfile,
}
