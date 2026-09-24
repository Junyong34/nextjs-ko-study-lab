import type { ProfileId, SourcePrice } from './types'
import { PROFILE_IDS, nowStamp } from './tags'

/**
 * 서버 프로세스 메모리에 있는 가격표 원본(DB 역할). 무효화 요청마다 버전이 1씩 오른다.
 * 개발 모드 HMR로 모듈이 다시 평가돼도 값이 유지되도록 globalThis에 둔다.
 */
type PriceStore = Record<ProfileId, SourcePrice>

const KEY = Symbol.for('functions-revalidate-tag-max-expiration:price-store')
const globalRef = globalThis as unknown as Record<symbol, PriceStore | undefined>

function store(): PriceStore {
  globalRef[KEY] ??= Object.fromEntries(
    PROFILE_IDS.map((id) => [id, { version: 1, updatedAt: '초기값', updatedAtMs: 0 }]),
  ) as PriceStore
  return globalRef[KEY]
}

export function readSourcePrice(id: ProfileId): SourcePrice {
  return { ...store()[id] }
}

export function bumpSourcePrice(id: ProfileId): SourcePrice {
  const at = nowStamp()
  store()[id] = { version: store()[id].version + 1, updatedAt: at.label, updatedAtMs: at.ms }
  return { ...store()[id] }
}
