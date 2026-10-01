import { SDK_DELAY_MS, type BootTiming, type PayAttempt, type TrialOrder, type TrialResult } from '../types'

export interface Check {
  label: string
  pass: boolean
}

export interface Judgement {
  /** 필수 실측(페이지 로드 타이밍 + parallel + chained)이 끝났고 모두 통과하면 true, 하나라도 어긋나면 false */
  matched: boolean | undefined
  actual: string[]
}

const mark = (pass: boolean) => (pass ? '일치' : '불일치')
const has = (t: TrialResult, kind: string) => t.events.some((e) => e.kind === kind)
const find = (t: TrialResult, kind: string) => t.events.find((e) => e.kind === kind)

export function judgeBoot(boot: BootTiming | null): Check[] | null {
  if (!boot || boot.afterInteractiveExecutedAt === null || boot.lazyOnloadExecutedAt === null) return null
  const lazyStart = boot.lazyOnloadRequestStart
  return [
    { label: 'lazyOnload 요청은 window load 이벤트 이후에 시작', pass: lazyStart !== null && lazyStart >= boot.loadEventStart && boot.loadEventStart > 0 },
    { label: 'afterInteractive가 lazyOnload보다 먼저 실행', pass: boot.afterInteractiveExecutedAt < boot.lazyOnloadExecutedAt },
  ]
}

/** 시도 하나가 해당 order에서 기대하는 동작과 일치하는지 실측값으로 판정한다. */
export function judgeTrial(t: TrialResult): Check[] {
  const sdkLoad = find(t, 'sdk-onLoad')
  const sdkReady = find(t, 'sdk-onReady')

  if (t.order === 'error') {
    return [
      { label: 'error: onError 호출, onLoad·onReady는 호출되지 않음', pass: has(t, 'sdk-onError') && !sdkLoad && !sdkReady },
      { label: 'error: 실패 후에도 window.PgSdk는 정의되지 않음', pass: has(t, 'sdk-onError') && t.events.every((e) => !e.sdkPresent) },
    ]
  }

  const base: Check[] = [
    { label: `${t.order}: SDK onLoad가 지연(${SDK_DELAY_MS}ms) 뒤에 호출되고 그 시점에 window.PgSdk 존재`, pass: !!sdkLoad && sdkLoad.at >= SDK_DELAY_MS && sdkLoad.sdkPresent },
    { label: `${t.order}: onReady가 onLoad 다음에 1회 호출`, pass: !!sdkLoad && !!sdkReady && sdkReady.seq > sdkLoad.seq && t.events.filter((e) => e.kind === 'sdk-onReady').length === 1 },
  ]
  if (!t.plugin) return [...base, { label: `${t.order}: 플러그인 로드 결과 수신`, pass: false }]

  if (t.order === 'parallel') {
    return [
      ...base,
      { label: 'parallel: 플러그인이 SDK보다 먼저 실행되어 PgSdk를 찾지 못함 (순서 보장 없음)', pass: !t.plugin.sdkPresent && !t.plugin.ok },
    ]
  }
  return [
    ...base,
    { label: 'chained: SDK onLoad 이후 요청된 플러그인이 PgSdk를 찾아 등록 성공', pass: t.plugin.sdkPresent && t.plugin.ok && !!sdkLoad && (t.pluginRequestStart ?? 0) >= sdkLoad.at - 5 },
  ]
}

export function judgePay(attempts: PayAttempt[]): Check[] {
  return attempts.map((a) => ({
    label: `결제 요청 #${a.seq} (SDK onLoad ${a.afterOnLoad ? '이후' : '이전'}): ${a.detail}`,
    pass: a.afterOnLoad ? a.ok : !a.ok,
  }))
}

const REQUIRED: TrialOrder[] = ['parallel', 'chained']

export function judge(boot: BootTiming | null, trials: Partial<Record<TrialOrder, TrialResult>>, attempts: PayAttempt[]): Judgement {
  const sections: Check[][] = []
  const bootChecks = judgeBoot(boot)
  if (bootChecks) sections.push(bootChecks)
  for (const order of ['parallel', 'chained', 'error'] as TrialOrder[]) {
    const t = trials[order]
    if (t && (t.plugin || has(t, 'sdk-onError') || has(t, 'sdk-onReady'))) sections.push(judgeTrial(t))
  }
  if (attempts.length > 0) sections.push(judgePay(attempts))

  const actual = sections.flat().map((c) => `• ${c.label}: ${mark(c.pass)}`)
  if (actual.length === 0) return { matched: undefined, actual }

  const pending = REQUIRED.filter((o) => !trials[o]?.plugin)
  if (pending.length > 0) actual.push(`• 아직 실측하지 않은 필수 시도: ${pending.join(', ')}`)
  if (!bootChecks) actual.push('• 페이지 로드 strategy 타이밍 측정 중')

  const failed = sections.flat().some((c) => !c.pass)
  return { matched: failed ? false : pending.length === 0 && !!bootChecks ? true : undefined, actual }
}
