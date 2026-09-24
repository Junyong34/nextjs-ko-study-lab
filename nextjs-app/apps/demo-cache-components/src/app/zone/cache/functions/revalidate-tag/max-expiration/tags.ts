import type { ProfileId, ProfileRow } from './types'

// 태그는 앱 전역이므로 데모 접두사를 붙인다 (apps/AGENTS.md 8항)
const PREFIX = 'functions-revalidate-tag-max-expiration'

/** 이 데모의 Route Handler 기준 경로 (zone 내부 경로) */
export const BASE_PATH = '/zone/cache/functions/revalidate-tag/max-expiration'

/** getCachedPrice 본문의 원본 조회 지연(ms). 재계산을 기다린 요청은 이만큼 느려진다. */
export const ORIGIN_LATENCY_MS = 600

export const PROFILE_IDS: ProfileId[] = ['max', 'hours', 'expire5', 'expire0']

// expireSeconds: 'max'·'hours'는 next.config에서 재정의하지 않은 Next.js 16.3.2 기본 cacheLife 프리셋의 expire 값
export const PROFILES: Record<ProfileId, ProfileRow> = {
  max: {
    name: '전 상품 기본가',
    code: "revalidateTag(tag, 'max')",
    profile: 'max',
    expireSeconds: 60 * 60 * 24 * 365,
    tag: `${PREFIX}:price:max`,
  },
  hours: {
    name: '회원 등급가',
    code: "revalidateTag(tag, 'hours')",
    profile: 'hours',
    expireSeconds: 60 * 60 * 24,
    tag: `${PREFIX}:price:hours`,
  },
  expire5: {
    name: '타임세일가',
    code: 'revalidateTag(tag, { expire: 5 })',
    profile: { expire: 5 },
    expireSeconds: 5,
    tag: `${PREFIX}:price:expire5`,
  },
  expire0: {
    name: '품절 표시',
    code: 'revalidateTag(tag, { expire: 0 })',
    profile: { expire: 0 },
    expireSeconds: 0,
    tag: `${PREFIX}:price:expire0`,
  },
}

export function parseProfileId(value: unknown): ProfileId | null {
  return typeof value === 'string' && (PROFILE_IDS as string[]).includes(value) ? (value as ProfileId) : null
}

/** 비교용 epoch ms + 표시용 HH:mm:ss.SSS(UTC) */
export function nowStamp() {
  const ms = Date.now()
  return { ms, label: new Date(ms).toISOString().slice(11, 23) }
}
