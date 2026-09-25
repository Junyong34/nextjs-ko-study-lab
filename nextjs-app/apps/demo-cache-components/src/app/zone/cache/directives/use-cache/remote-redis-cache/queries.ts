import { cacheLife, cacheTag } from 'next/cache'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import type { CategoryStatsResult, Currency, StatsCategory } from './types'
import { formatServerTime } from './types'

// 데모 태그 접두사. zone 전역에서 캐시 태그를 공유하므로 다른 데모의 태그를 지우지 않도록 접두사를 붙인다.
const TAG_PREFIX = 'directives-use-cache-remote-redis-cache'
const KRW_PER_USD = 1400

// 서버 프로세스 메모리에 남는 실행 카운터. 캐시 HIT이면 본문이 실행되지 않으므로 그대로다.
// default·remote를 별도로 세어, 두 지시어가 서로 다른 캐시 키(=별도 항목)를 갖는다는 것을 관측한다.
let defaultGlobalExec = 0
let remoteGlobalExec = 0
const defaultExecByArgs = new Map<string, number>()
const remoteExecByArgs = new Map<string, number>()

function computePartial(category: StatsCategory, currency: Currency) {
  const rate = currency === 'USD' ? 1 / KRW_PER_USD : 1
  const rows = MOCK_PRODUCTS.filter((p) => p.category === category)
  const avgPrice = Math.round(
    (rows.reduce((sum, p) => sum + p.price, 0) / Math.max(rows.length, 1)) * rate * 100,
  ) / 100
  return { productCount: rows.length, avgPrice }
}

/**
 * 대조군: 일반 'use cache' (in-memory, 이 앱에서는 cacheHandlers 미설정이므로 내장 LRU).
 * 아래 getRemoteCategoryStats와 로직은 동일하고 지시어만 다르다 — 캐시 키에 함수 ID가 포함되므로
 * 인자가 같아도 이 함수와 getRemoteCategoryStats는 서로 다른 캐시 항목을 만든다.
 */
export async function getDefaultCategoryStats(
  category: StatsCategory,
  currency: Currency,
): Promise<CategoryStatsResult> {
  'use cache'
  cacheTag(`${TAG_PREFIX}:default:${category}`)
  cacheLife({ stale: 15, revalidate: 30, expire: 300 })

  defaultGlobalExec += 1
  const argsKey = `${category}|${currency}`
  const argsExecNo = (defaultExecByArgs.get(argsKey) ?? 0) + 1
  defaultExecByArgs.set(argsKey, argsExecNo)

  return {
    kind: 'default',
    category,
    currency,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: formatServerTime(new Date()),
    globalExecNo: defaultGlobalExec,
    argsExecNo,
    ...computePartial(category, currency),
  }
}

/**
 * 실험군: 'use cache: remote'. cacheHandlers.remote를 등록하지 않은 이 앱에서는
 * Next.js가 'remote' 키를 'default'와 같은 내장 in-memory 핸들러 인스턴스에 연결한다
 * (node_modules/next/dist/server/use-cache/handlers.js의 initializeCacheHandlers 참고).
 * 즉 이 함수와 위 getDefaultCategoryStats는 저장소 인스턴스는 같지만, 캐시 키(함수 ID 포함)가
 * 달라 서로 다른 항목으로 저장된다 — 3단 검증 패널에서 handler-probe.ts로 이 사실을 직접 확인한다.
 */
export async function getRemoteCategoryStats(
  category: StatsCategory,
  currency: Currency,
): Promise<CategoryStatsResult> {
  'use cache: remote'
  cacheTag(`${TAG_PREFIX}:remote:${category}`)
  cacheLife({ stale: 15, revalidate: 30, expire: 300 })

  remoteGlobalExec += 1
  const argsKey = `${category}|${currency}`
  const argsExecNo = (remoteExecByArgs.get(argsKey) ?? 0) + 1
  remoteExecByArgs.set(argsKey, argsExecNo)

  return {
    kind: 'remote',
    category,
    currency,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: formatServerTime(new Date()),
    globalExecNo: remoteGlobalExec,
    argsExecNo,
    ...computePartial(category, currency),
  }
}
