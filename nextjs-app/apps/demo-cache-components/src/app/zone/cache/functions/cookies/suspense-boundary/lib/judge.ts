import { READ_DELAY_MS } from './constants'
import type { StreamRun } from '../types'

/** 정적 마커와 쿠키 마커가 도착한 시각 차이 (ms). 컴파일·네트워크 지연이 두 마커에 똑같이 섞이므로 TTFB보다 안정적이다. */
export function arrivalGap(run: StreamRun): number | null {
  return run.staticAt && run.sessionAt ? run.sessionAt.ms - run.staticAt.ms : null
}

/** 서버가 읽은 쿠키 값이 학습자가 보낸 쿠키 상태와 같은가 */
function cookieRead(run: StreamRun): boolean {
  return run.sessionUser === (run.cookieSent ?? 'none')
}

/**
 * 기대 판정.
 * - inside: fallback이 먼저 오고, 쿠키 영역은 스트리밍 세그먼트로 지연 시간만큼 뒤에 도착한다.
 * - outside: fallback 없이 정적 마크업과 쿠키 영역이 같은 시점에 함께 도착한다(응답 전체가 쿠키 읽기를 기다림).
 */
export function judgeRun(run: StreamRun): boolean {
  if (run.status !== 200 || !cookieRead(run)) return false
  const gap = arrivalGap(run)
  if (gap === null) return false
  if (run.target === 'inside') {
    return run.fallbackAt !== null && run.sessionInStreamSegment && gap >= READ_DELAY_MS * 0.5
  }
  return run.fallbackAt === null && gap < READ_DELAY_MS * 0.3
}
