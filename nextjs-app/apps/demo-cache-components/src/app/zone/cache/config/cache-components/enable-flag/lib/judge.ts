import type { ActivityReturn, CheckResult, MarkerHit, StreamRun } from '../types'
import { REQUEST_DELAY_MS } from './delay'

function at(hit: MarkerHit | null) {
  return hit ? `${hit.offset}자·${hit.ms}ms` : '없음'
}

export function judgeFlag(serverFlag: unknown, clientFlag: unknown): CheckResult {
  const pass = serverFlag === true && clientFlag === true
  return {
    key: 'flag',
    label: '플래그 값',
    pass,
    detail: `서버 번들 ${String(serverFlag)} / 클라이언트 번들 ${String(clientFlag)}`,
  }
}

/** 정적 마크업·'use cache'·fallback이 앞에, 요청 시점 데이터는 뒤쪽 S:n 세그먼트로 도착했는가 */
export function judgeStream(run: StreamRun | undefined): CheckResult {
  const label = 'probe 응답 스트리밍'
  if (!run) return { key: 'stream', label, pass: undefined, detail: '측정 대기 — [probe 측정]을 눌러 주세요.' }
  const { staticAt, cachedAt, fallbackAt, requestAt } = run
  const pass = Boolean(
    staticAt && cachedAt && fallbackAt && requestAt && run.requestInStreamSegment &&
      staticAt.offset < requestAt.offset && cachedAt.offset < requestAt.offset && fallbackAt.offset < requestAt.offset,
  )
  return {
    key: 'stream',
    label,
    pass,
    detail: `#${run.runNo} 헤더 ${run.headersMs}ms · ①${at(staticAt)} ②${at(cachedAt)} ③fallback ${at(fallbackAt)} → 요청 데이터 ${at(requestAt)}${run.requestInStreamSegment ? ' (S:n 세그먼트)' : ' (세그먼트 아님)'}`,
  }
}

/** 최근 두 번의 probe 측정에서 'use cache' ID는 같고 요청 시점 ID는 달라야 한다 */
export function judgeUseCache(probeRuns: StreamRun[]): CheckResult {
  const label = "'use cache' 재사용"
  const [prev, last] = probeRuns.slice(-2)
  if (!prev || !last) {
    return { key: 'useCache', label, pass: undefined, detail: `probe 측정 ${probeRuns.length}/2회 — 2회 이상 필요` }
  }
  const pass = Boolean(last.cachedId && prev.cachedId === last.cachedId && prev.requestId !== last.requestId)
  return {
    key: 'useCache',
    label,
    pass,
    detail: `캐시 ID ${prev.cachedId} → ${last.cachedId} (${prev.cachedId === last.cachedId ? '재사용' : '재계산 — dev 파일 변경(HMR)·revalidate 경과 시 생길 수 있으니 한 번 더 측정'}), 요청 ID ${prev.requestId} → ${last.requestId} (${prev.requestId !== last.requestId ? '매번 새로' : '중복'})`,
  }
}

/** instant = false로 셸을 포기한 라우트는 데이터가 끝날 때까지 헤더조차 오지 않는다 */
export function judgeBlocking(run: StreamRun | undefined): CheckResult {
  const label = 'blocking 대조'
  if (!run) return { key: 'blocking', label, pass: undefined, detail: '측정 대기 — [blocking 측정]을 눌러 주세요.' }
  const pass = run.fallbackAt === null && run.requestAt !== null && run.headersMs >= REQUEST_DELAY_MS
  return {
    key: 'blocking',
    label,
    pass,
    detail: `#${run.runNo} 헤더 ${run.headersMs}ms (지연 ${REQUEST_DELAY_MS}ms 이상이어야 함) · fallback ${run.fallbackAt ? '있음' : '없음'} · 요청 데이터 ${at(run.requestAt)}`,
  }
}

/** away 페이지에서 본 숨겨진 DOM과, 돌아온 뒤의 state가 같은 인스턴스인가 */
export function judgeActivity(ret: ActivityReturn | null): CheckResult {
  const label = 'Activity 상태 보존'
  if (!ret) {
    return { key: 'activity', label, pass: undefined, detail: '관측 대기 — 입력 후 [다른 라우트로 이동] → [돌아오기]를 해 주세요.' }
  }
  const { obs, instanceAtReturn: instanceId, draftAtReturn: draft } = ret
  const sameInstance = obs.instanceId === instanceId
  const pass = obs.foundLab && obs.hiddenByDisplayNone && sameInstance && draft !== '' && obs.draftSeen === draft
  return {
    key: 'activity',
    label,
    pass,
    detail: `away에서 이전 DOM ${obs.foundLab ? '발견' : '없음'}${obs.hiddenByDisplayNone ? '(display: none)' : ''} · 인스턴스 ${obs.instanceId ?? '-'} → 복귀 시 ${instanceId} (${sameInstance ? '동일' : '재마운트'}) · 입력값 "${obs.draftSeen ?? ''}" → "${draft}"`,
  }
}
