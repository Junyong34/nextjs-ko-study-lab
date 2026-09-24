import type { SdkEvent } from '../types'

export interface CheckResult {
  label: string
  /** undefined = 아직 조건을 만들지 않음(대기) */
  pass: boolean | undefined
  actual: string
}

/** 실측 로그만으로 공식 문서의 onLoad / onReady / onError 동작을 판정한다. */
export function summarizeEvents(events: SdkEvent[]) {
  const main = events.filter((e) => e.scope === 'main')
  const fail = events.filter((e) => e.scope !== 'main')
  const mounts = main.filter((e) => e.kind === 'mount')
  const onLoads = main.filter((e) => e.kind === 'onLoad')
  const onReadys = main.filter((e) => e.kind === 'onReady')
  const aways = events.filter((e) => e.kind === 'away')
  const firstEarly = main.find((e) => e.kind === 'early-call' && e.mountNo === 1)
  const failErrors = fail.filter((e) => e.kind === 'onError')
  const failSuccessCallbacks = fail.filter((e) => e.kind === 'onLoad' || e.kind === 'onReady')
  const maxExec = events.reduce((m, e) => Math.max(m, e.execCount ?? 0), 0)

  const loaded = onLoads.length > 0
  const roundTripped = mounts.length >= 2 && aways.length >= 1
  const failTried = fail.length > 0
  const readyMountNos = onReadys.map((e) => e.mountNo).join(', ')

  const checks: CheckResult[] = [
    {
      label: '첫 마운트 직후(스크립트 로드 전) window.DemoPay.init() 호출은 실패',
      pass: firstEarly ? firstEarly.ok === false && !firstEarly.sdkPresent : undefined,
      actual: firstEarly ? `window.DemoPay ${firstEarly.sdkPresent ? '있음' : '없음'} · ${firstEarly.detail}` : '마운트 기록 대기',
    },
    {
      label: 'onLoad 호출 시점에는 window.DemoPay가 존재',
      pass: loaded ? onLoads.every((e) => e.sdkPresent) : undefined,
      actual: loaded ? onLoads.map((e) => `t=${e.at.toFixed(1)}ms 존재=${e.sdkPresent}`).join(' / ') : 'onLoad 대기',
    },
    {
      label: '재마운트 후에도 onLoad는 최초 1회뿐',
      pass: roundTripped ? onLoads.length === 1 : undefined,
      actual: `마운트 ${mounts.length}회 · onLoad ${onLoads.length}회`,
    },
    {
      label: 'onReady는 마운트마다 1회씩 호출(최초는 load 직후)',
      pass: roundTripped ? onReadys.length === mounts.length && onReadys.every((e) => e.ok) : undefined,
      actual: `마운트 ${mounts.length}회 · onReady ${onReadys.length}회 (마운트 회차: ${readyMountNos || '-'})`,
    },
    {
      label: 'SDK 스크립트 자체는 1번만 실행(재요청·재실행 없음)',
      pass: roundTripped ? maxExec === 1 : undefined,
      actual: `window.DemoPay.executionCount 최댓값 = ${maxExec}`,
    },
    {
      label: 'HTTP 오류 응답이면 onError만 호출되고 onLoad/onReady는 호출 안 됨',
      pass: failTried ? failErrors.length >= 1 && failSuccessCallbacks.length === 0 : undefined,
      actual: failTried
        ? `onError ${failErrors.length}회 · onLoad/onReady ${failSuccessCallbacks.length}회${failErrors[0] ? ` · ${failErrors[0].detail}` : ''}`
        : '장애 시나리오 대기',
    },
  ]

  const allDone = checks.every((c) => c.pass !== undefined)
  const isMatched = allDone ? checks.every((c) => c.pass) : undefined
  return { checks, isMatched }
}
