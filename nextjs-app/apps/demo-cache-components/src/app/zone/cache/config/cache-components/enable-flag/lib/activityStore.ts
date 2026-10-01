import type { AwayObservation } from '../types'
import { ACTIVITY_LAB_ATTR } from './routes'

/**
 * 클라이언트 모듈 스코프 저장소. 클라이언트 내비게이션 동안 같은 모듈 인스턴스가 유지되므로
 * away 페이지가 기록한 관측값을 실습 화면이 돌아왔을 때 읽을 수 있다 (새로고침하면 비워진다).
 */
let latest: AwayObservation | null = null
let seq = 0

export function readAwayObservation(): AwayObservation | null {
  return latest
}

export function clearAwayObservation() {
  latest = null
}

/** away 페이지 마운트 시점에 문서에 남아 있는 실습 화면 DOM을 직접 조사한다 */
export function inspectHiddenLab(): AwayObservation {
  const lab = document.querySelector<HTMLElement>(`[${ACTIVITY_LAB_ATTR}]`)
  let hiddenByDisplayNone = false
  for (let node: HTMLElement | null = lab; node; node = node.parentElement) {
    if (getComputedStyle(node).display === 'none') {
      hiddenByDisplayNone = true
      break
    }
  }
  seq += 1
  latest = {
    seq,
    foundLab: lab !== null,
    hiddenByDisplayNone,
    draftSeen: lab?.querySelector('input')?.value ?? null,
    instanceId: lab?.dataset.instanceId ?? null,
    at: new Date().toLocaleTimeString('ko-KR'),
  }
  return latest
}
