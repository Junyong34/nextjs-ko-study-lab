'use server'

import { updateTag } from 'next/cache'
import { currentBootId, executionCount, raiseFirstPrice, resetTable, snapshot } from './db'
import { getPriceSummary, getProductsByCategory } from './queries'
import { CATEGORIES, TAGS, isCategory } from './tags'
import type { ActionResult, CallRecord, CallStatus, Currency, DbSnapshot, QueryStamp } from './types'

/** 캐시 함수 호출 전후의 쿼리 카운터와 반환된 실행 기록으로 HIT/MISS/STALE을 판정한다 */
function classify(stamp: QueryStamp, before: number, after: number) {
  const sameProcess = stamp.bootId === currentBootId()
  const executedInThisCall = sameProcess && stamp.runId > before
  const status: CallStatus = executedInThisCall ? 'MISS' : after > before ? 'STALE' : 'HIT'
  const executedAt = new Date(stamp.executedAt)
  return {
    status,
    runId: stamp.runId,
    fromOtherProcess: !sameProcess,
    executedAtIso: executedAt.toISOString(),
    // unstable_cache는 결과를 JSON.stringify로 저장하므로 HIT/STALE에서는 Date가 string으로 복원된다
    executedAtType: stamp.executedAt instanceof Date ? 'Date' : typeof stamp.executedAt,
    ageSec: Math.max(0, Math.round((Date.now() - executedAt.getTime()) / 100) / 10),
    countBefore: before,
    countAfter: after,
    calledAtIso: new Date().toISOString(),
  }
}

export async function queryCategoryAction(category: unknown): Promise<ActionResult<CallRecord>> {
  if (!isCategory(category)) throw new Error(`알 수 없는 카테고리: ${String(category)}`)
  const before = executionCount()
  const result = await getProductsByCategory(category)
  const after = executionCount()
  const record: CallRecord = {
    kind: 'category',
    key: `category:${category}`,
    label: `getProductsByCategory('${category}')`,
    category,
    prices: Object.fromEntries(result.rows.map((r) => [r.id, r.price])),
    summary: result.rows.map((r) => `${r.name} ${r.price.toLocaleString('ko-KR')}원`).join(' / '),
    ...classify(result, before, after),
  }
  return { data: record, snapshot: snapshot() }
}

export async function querySummaryAction(
  currency: Currency,
  includeCurrencyInKey: boolean,
): Promise<ActionResult<CallRecord>> {
  if (currency !== 'KRW' && currency !== 'USD') throw new Error(`알 수 없는 통화: ${String(currency)}`)
  const before = executionCount()
  const result = await getPriceSummary(currency, includeCurrencyInKey === true)
  const after = executionCount()
  const record: CallRecord = {
    kind: 'summary',
    key: `summary:${currency}:${includeCurrencyInKey ? 'keyed' : 'unkeyed'}`,
    label: `getPriceSummary('${currency}') · keyParts ${includeCurrencyInKey ? '포함' : '누락'}`,
    requestedCurrency: currency,
    returnedCurrency: result.currency,
    includeCurrencyInKey: includeCurrencyInKey === true,
    summary: `합계 ${result.total} (반환 통화 ${result.currency})`,
    ...classify(result, before, after),
  }
  return { data: record, snapshot: snapshot() }
}

/** tags 옵션으로 묶인 엔트리를 즉시 만료 (updateTag는 Server Action 전용) */
export async function invalidateAction(scope: unknown): Promise<ActionResult<string>> {
  if (scope !== 'all' && !isCategory(scope)) throw new Error(`알 수 없는 범위: ${String(scope)}`)
  const tag = scope === 'all' ? TAGS.all : TAGS.category(scope)
  updateTag(tag)
  return { data: tag, snapshot: snapshot() }
}

/** DB UPDATE만 실행하고 캐시는 건드리지 않는다 → 캐시된 조회 결과가 원본과 어긋나는지 관찰 */
export async function raisePriceAction(category: unknown) {
  if (!isCategory(category)) throw new Error(`알 수 없는 카테고리: ${String(category)}`)
  const change = raiseFirstPrice(category)
  return { data: { ...change, categoryName: CATEGORIES[category] }, snapshot: snapshot() }
}

/** 초기화: 테이블을 시드로 되돌리고 이 데모의 전체 태그를 만료 (쿼리 카운터는 누적 유지) */
export async function resetDemoAction(): Promise<DbSnapshot> {
  resetTable()
  updateTag(TAGS.all)
  return snapshot()
}
