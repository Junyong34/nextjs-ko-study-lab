import { unstable_cache } from 'next/cache'
import { runQuery } from './db'
import { DEMO_PREFIX, REVALIDATE_SECONDS, TAGS } from './tags'
import type { Category, CategoryQueryResult, Currency, PriceSummaryResult } from './types'

const USD_RATE = 1350

/** 캐시 대상 "DB 쿼리": 카테고리를 인자로 받는다 */
async function selectProductsByCategory(category: Category): Promise<CategoryQueryResult> {
  // SELECT * FROM products WHERE category = $1
  const { rows, ...stamp } = runQuery((row) => row.category === category)
  return { category, rows, ...stamp }
}

/**
 * [인자 기반 키] category는 인자로 전달되므로 unstable_cache가 JSON.stringify(args)를 키에 자동 포함한다.
 * keyParts는 네임스페이스 역할만 한다. tags는 키가 아니라 무효화 그룹이다.
 */
export function getProductsByCategory(category: Category) {
  return unstable_cache(selectProductsByCategory, [DEMO_PREFIX, 'products-by-category'], {
    tags: [TAGS.all, TAGS.category(category)],
    revalidate: REVALIDATE_SECONDS,
  })(category)
}

/**
 * [클로저 키] loadSummary는 인자 없이 바깥 스코프의 currency를 읽는다.
 * 키는 "함수 소스 문자열 + keyParts + 인자"뿐이라, currency를 keyParts에 넣지 않으면
 * KRW/USD 호출이 같은 키를 공유해 먼저 저장된 통화의 결과가 그대로 돌아온다.
 */
export function getPriceSummary(currency: Currency, includeCurrencyInKey: boolean) {
  const loadSummary = async (): Promise<PriceSummaryResult> => {
    // SELECT SUM(price) FROM products
    const { rows, ...stamp } = runQuery(() => true)
    const krw = rows.reduce((sum, row) => sum + row.price, 0)
    const total =
      currency === 'KRW' ? `${krw.toLocaleString('ko-KR')}원` : `$${(krw / USD_RATE).toFixed(2)}`
    return { currency, total, ...stamp }
  }

  const keyParts = includeCurrencyInKey
    ? [DEMO_PREFIX, 'price-summary', currency]
    : [DEMO_PREFIX, 'price-summary']

  return unstable_cache(loadSummary, keyParts, {
    tags: [TAGS.all],
    revalidate: REVALIDATE_SECONDS,
  })()
}
