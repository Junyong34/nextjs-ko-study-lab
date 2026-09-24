import { REVALIDATE_SECONDS } from './tags'
import type { CallRecord, TimelineEvent } from './types'

export type CheckState = 'pending' | 'pass' | 'fail'

export interface CheckItem {
  id: string
  title: string
  expected: string
  state: CheckState
  evidence: string
}

type CallEvent = Extract<TimelineEvent, { type: 'call' }>

const covers = (scope: string, record: CallRecord) =>
  scope === 'all' || (record.kind === 'category' && record.category === scope)

const fmt = (e: CallEvent) =>
  `#${e.seq} ${e.record.label} → ${e.record.status} (runId #${e.record.runId}, 카운터 ${e.record.countBefore}→${e.record.countAfter})`

/** 이번 세션에서 실제로 관측한 호출·무효화·DB 변경 기록만으로 각 항목을 판정한다 */
export function evaluate(events: TimelineEvent[]): CheckItem[] {
  const calls = events.filter((e): e is CallEvent => e.type === 'call')
  const categoryCalls = calls.filter((e) => e.record.kind === 'category')
  const between = (from: number, to: number) => events.filter((e) => e.seq > from && e.seq < to)

  // 1. 같은 인자 재호출 → 쿼리 미실행
  const reuse = categoryCalls.find((e) => {
    const prev = categoryCalls.filter((p) => p.seq < e.seq && p.record.key === e.record.key).at(-1)
    return e.record.status === 'HIT' && prev && prev.record.runId === e.record.runId
  })

  // 2. DB UPDATE 후 무효화 전 조회는 옛 가격
  let staleData: string | null = null
  for (const w of events) {
    if (w.type !== 'write') continue
    const hit = categoryCalls.find(
      (c) =>
        c.seq > w.seq &&
        c.record.status !== 'MISS' &&
        c.record.prices?.[w.productId] !== undefined &&
        c.record.prices[w.productId] !== w.newPrice &&
        !between(w.seq, c.seq).some((x) => x.type === 'invalidate' && covers(x.scope, c.record)),
    )
    if (hit) {
      staleData = `DB에서 ${w.productId}=${w.newPrice.toLocaleString('ko-KR')}원으로 변경 후 ${fmt(hit)} — 캐시는 ${hit.record.prices?.[w.productId]?.toLocaleString('ko-KR')}원 반환`
      break
    }
  }

  // 3. tags 무효화 후 첫 호출은 재실행(MISS)
  let tagPass: string | null = null
  let tagFail: string | null = null
  for (const inv of events) {
    if (inv.type !== 'invalidate') continue
    for (const c of categoryCalls.filter((c) => c.seq > inv.seq && covers(inv.scope, c.record))) {
      const earlier = between(inv.seq, c.seq).some((x) => x.type === 'call' && x.record.key === c.record.key)
      if (earlier) continue
      const line = `updateTag('${inv.tag}') 후 ${fmt(c)}`
      if (c.record.status === 'MISS') tagPass ??= line
      else tagFail ??= line
    }
  }

  // 4. revalidate 경과 → STALE 반환 + 백그라운드 재실행, 다음 호출에서 새 결과
  // STALE 호출 중 백그라운드 재실행된 쿼리의 runId(=그 호출 직후 카운터)를 다음 호출이 받았는지 확인
  const nextOf = (s: CallEvent) => calls.find((e) => e.seq > s.seq && e.record.key === s.record.key)
  const staleCalls = calls.filter((e) => e.record.status === 'STALE')
  const refreshed = staleCalls.find((s) => {
    const next = nextOf(s)
    return next && !next.record.fromOtherProcess && next.record.runId === s.record.countAfter
  })
  const stale = refreshed ?? staleCalls.at(-1)
  const afterStale = stale && nextOf(stale)
  const lateHit = calls.find((e) => e.record.status === 'HIT' && e.record.ageSec > REVALIDATE_SECONDS + 1)

  // 5. keyParts 누락 시 키 충돌
  const summaries = calls.filter((e) => e.record.kind === 'summary')
  const collision = summaries.find(
    (e) => !e.record.includeCurrencyInKey && e.record.returnedCurrency !== e.record.requestedCurrency,
  )
  const keyedWrong = summaries.find(
    (e) => e.record.includeCurrencyInKey && e.record.returnedCurrency !== e.record.requestedCurrency,
  )

  return [
    {
      id: 'reuse',
      title: '인자 기반 키 재사용',
      expected: '같은 카테고리를 다시 조회하면 쿼리 카운터가 그대로이고 같은 runId가 돌아온다',
      state: reuse ? 'pass' : 'pending',
      evidence: reuse ? fmt(reuse) : '같은 카테고리를 두 번 조회해 보세요.',
    },
    {
      id: 'stale-data',
      title: 'DB 변경은 캐시에 자동 반영되지 않음',
      expected: '[가격 +1,000원] 후 무효화 없이 조회하면 캐시된 옛 가격이 반환된다',
      state: staleData ? 'pass' : 'pending',
      evidence: staleData ?? '가격 변경 후 무효화 없이 같은 카테고리를 조회해 보세요.',
    },
    {
      id: 'tags',
      title: 'tags 옵션 + updateTag',
      expected: '태그 무효화 직후 그 태그를 가진 키의 첫 조회는 쿼리를 재실행(MISS)한다',
      state: tagFail ? 'fail' : tagPass ? 'pass' : 'pending',
      evidence: tagFail ?? tagPass ?? '조회 → updateTag → 같은 카테고리 재조회 순서로 실행해 보세요.',
    },
    {
      id: 'revalidate',
      title: `revalidate: ${REVALIDATE_SECONDS}초`,
      expected: `${REVALIDATE_SECONDS}초가 지난 뒤 첫 호출은 옛 값(STALE)을 주면서 쿼리를 백그라운드로 재실행하고, 다음 호출이 새 runId를 받는다`,
      state: lateHit
        ? 'fail'
        : refreshed
          ? 'pass'
          : 'pending',
      evidence: lateHit
        ? `${fmt(lateHit)} — 결과 나이 ${lateHit.record.ageSec}초인데 HIT`
        : stale
          ? `${fmt(stale)} — 결과 나이 ${stale.record.ageSec}초, 백그라운드 실행 runId #${stale.record.countAfter}${afterStale ? `\n  다음 호출 ${fmt(afterStale)}` : '\n  같은 버튼을 한 번 더 눌러 보세요.'}`
          : `조회 후 ${REVALIDATE_SECONDS}초 이상 기다렸다가 같은 버튼을 눌러 보세요.`,
    },
    {
      id: 'keyparts',
      title: '클로저 변수와 keyParts',
      expected: 'keyParts에 currency를 빼면 다른 통화 요청에도 먼저 저장된 통화 결과가 돌아오고, 넣으면 요청 통화 그대로 돌아온다',
      state: keyedWrong ? 'fail' : collision ? 'pass' : 'pending',
      evidence: keyedWrong
        ? `${fmt(keyedWrong)} — keyParts에 통화를 넣었는데도 ${keyedWrong.record.returnedCurrency} 반환`
        : collision
          ? `${fmt(collision)} — ${collision.record.requestedCurrency} 요청에 ${collision.record.returnedCurrency} 결과`
          : '[keyParts 누락] 쪽에서 KRW와 USD를 번갈아 조회해 보세요.',
    },
  ]
}
