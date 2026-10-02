import { ERROR_MARKER, MASKED_MESSAGE, TRIALS } from './trials'
import type { AssetScan, TrialResult, TrialSpec, Verdict } from '../types'

/** 오류 메시지가 가려졌는지(true), 상세한지(false), 판정할 수 없는지(null) */
export function isMasked(message: string | null): boolean | null {
  if (message === null) return null
  if (message === MASKED_MESSAGE) return true
  return message.includes(ERROR_MARKER) ? false : null
}

/** 한 시도의 실측값을 기대값과 비교해 어긋난 점을 돌려준다. 빈 배열이면 일치. */
export function trialMismatches(spec: TrialSpec, result: TrialResult): string[] {
  const out: string[] = []
  const expectedAttr = spec.crossOrigin ?? null
  if (result.attr !== expectedAttr) out.push(`crossorigin 속성이 ${result.attr ?? '없음'}입니다(기대: ${expectedAttr ?? '없음'}).`)
  if (result.outcome === 'timeout') {
    out.push('5초 안에 onLoad/onError가 오지 않았습니다.')
    return out
  }
  const loaded = result.outcome === 'load'
  if (loaded !== spec.expectLoaded) out.push(`${loaded ? 'onLoad' : 'onError'}가 호출됐습니다(기대: ${spec.expectLoaded ? 'onLoad' : 'onError'}).`)
  if (loaded && result.echo === null) out.push('로드됐지만 스크립트 실행 흔적이 없습니다.')
  if (!loaded && result.echo !== null) out.push('차단됐다고 보고됐지만 스크립트가 실행됐습니다.')
  if (loaded && spec.expectDetailed !== null) {
    const masked = isMasked(result.errorMessage)
    if (masked === null) out.push('스크립트 오류 이벤트를 받지 못했습니다.')
    else if (masked === spec.expectDetailed) {
      out.push(spec.expectDetailed ? '오류 메시지가 "Script error."로 가려졌습니다.' : '오류 메시지가 가려지지 않았습니다.')
    }
  }
  return out
}

/** 다섯 가지 조합을 모두 실측한 뒤 판정한다. 교차 출처를 만들 수 없는 환경이면 판정 불가. */
export function judgeTrials(results: Record<string, TrialResult>, crossOriginAvailable: boolean): Verdict {
  if (!crossOriginAvailable) {
    return { isMatched: undefined, reasons: ['이 주소에서는 다른 출처(localhost ↔ 127.0.0.1)를 만들 수 없어 판정 불가입니다.'] }
  }
  const missing = TRIALS.filter((spec) => !results[spec.id])
  if (missing.length > 0) {
    return { isMatched: undefined, reasons: [`아직 실행하지 않은 조합 ${missing.length}개: ${missing.map((s) => s.label).join(', ')}`] }
  }
  const reasons = TRIALS.flatMap((spec) => trialMismatches(spec, results[spec.id]).map((r) => `${spec.label}: ${r}`))
  if (reasons.length === 0) return { isMatched: true, reasons: ['다섯 조합 모두 실측값이 기대와 일치합니다.'] }
  return { isMatched: false, reasons }
}

/**
 * 이 앱은 crossOrigin을 설정하지 않았으므로 부트스트랩 태그(설정이 값을 넘기는 대상)에는 crossorigin이 없어야 한다.
 * Flight 청크의 값은 설정과 다른 경로(client reference manifest)에서 오므로 판정하지 않고 관찰값으로만 보여 준다.
 */
export function judgeScan(scan: AssetScan | null): Verdict {
  if (!scan) return { isMatched: undefined, reasons: ['[문서 태그 검사]를 누르면 측정합니다.'] }
  if (scan.bootstrap.total === 0) return { isMatched: undefined, reasons: ['부트스트랩 태그를 찾지 못해 판정 불가입니다.'] }
  const chunkValues = Array.from(new Set(scan.chunks.withCrossOrigin.map((item) => `"${item.value}"`)))
  const chunkNote = `관찰(판정 제외): Flight 청크 async 스크립트 ${scan.chunks.total}개 중 ${scan.chunks.withCrossOrigin.length}개에 crossorigin${chunkValues.length ? `=${chunkValues.join(', ')}` : ''}.`
  if (scan.bootstrap.withCrossOrigin.length === 0) {
    return { isMatched: true, reasons: [`부트스트랩 태그 ${scan.bootstrap.total}개 모두 crossorigin 속성이 없습니다.`, chunkNote] }
  }
  return {
    isMatched: false,
    reasons: [...scan.bootstrap.withCrossOrigin.map((item) => `${item.url}에 crossorigin="${item.value}"가 있습니다.`), chunkNote],
  }
}
