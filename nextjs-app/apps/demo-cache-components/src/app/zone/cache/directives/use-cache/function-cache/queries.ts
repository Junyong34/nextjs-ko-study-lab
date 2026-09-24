import { cacheLife } from 'next/cache'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import type { CategoryStats, Currency, StatsCategory } from './types'

// 서버 프로세스 메모리에 남는 실제 실행 카운터.
// 'use cache' 함수 본문이 "실제로 실행될 때만" 증가한다. 캐시 HIT이면 본문이 실행되지 않으므로 그대로다.
let globalExecCount = 0
const execCountByArgs = new Map<string, number>()

const KRW_PER_USD = 1400

/**
 * 함수 수준 'use cache': 본문 첫 줄의 지시어가 이 함수의 반환값을 캐시한다.
 * 캐시 키 = 빌드 ID + 함수 ID + 직렬화된 인자 [category, { currency }] (+ dev에서는 HMR 해시)
 */
export async function getCategoryStats(
  category: StatsCategory,
  options: { currency: Currency },
): Promise<CategoryStats> {
  'use cache'
  // 관측 도중 시간 만료로 다시 실행되지 않도록 수명을 명시한다 (revalidate 1시간).
  cacheLife('hours')

  globalExecCount += 1
  const argsKey = `${category}|${options.currency}`
  const argsExecNo = (execCountByArgs.get(argsKey) ?? 0) + 1
  execCountByArgs.set(argsKey, argsExecNo)

  const rate = options.currency === 'USD' ? 1 / KRW_PER_USD : 1
  const rows = MOCK_PRODUCTS.filter((p) => p.category === category)
  const convert = (krw: number) => Math.round(krw * rate * 100) / 100

  return {
    category,
    currency: options.currency,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date(),
    globalExecNo: globalExecCount,
    argsExecNo,
    productCount: rows.length,
    totalStock: rows.reduce((sum, p) => sum + p.stock, 0),
    avgPrice: convert(rows.reduce((sum, p) => sum + p.price, 0) / Math.max(rows.length, 1)),
    priceByProduct: new Map(rows.map((p) => [p.name, convert(p.price)])),
    tags: new Set(rows.flatMap((p) => p.tags)),
  }
}
