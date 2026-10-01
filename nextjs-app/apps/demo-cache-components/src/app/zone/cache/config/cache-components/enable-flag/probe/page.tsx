import { Suspense } from 'react'
import { getCachedStamp, getRequestStamp, REQUEST_DELAY_MS } from '../lib/stamps'

/**
 * 측정 대상 라우트. 실습 화면의 [응답 스트림 측정]이 이 URL의 HTML을 직접 읽어
 * 세 영역의 마커가 응답 어디에, 언제 도착하는지 기록한다.
 * 마커는 HTML 속성으로만 매칭한다 (RSC 인라인 스크립트 안의 값은 이스케이프돼 걸리지 않는다).
 */
export default function EnableFlagProbePage() {
  return (
    <main className="space-y-2 p-6 font-mono text-xs">
      <p data-demo-marker="probe-static">① 정적 마크업 — 데이터 없이 바로 그려지는 영역</p>
      <CachedBlock />
      <Suspense
        fallback={<p data-demo-marker="probe-fallback">③ 요청 시점 데이터 대기 중 (Suspense fallback)</p>}
      >
        <RequestBlock />
      </Suspense>
    </main>
  )
}

/** Suspense 없이 await해도 되는 이유: 'use cache' 결과라서 정적 셸에 포함된다 */
async function CachedBlock() {
  const stamp = await getCachedStamp()
  return (
    <p data-demo-marker="probe-cached" data-cached-id={stamp.id}>
      ② &apos;use cache&apos; 결과 #{stamp.id} (생성 {stamp.at})
    </p>
  )
}

/** connection() 이후 {REQUEST_DELAY_MS}ms 뒤에 값을 만든다 — Suspense 안에서만 허용된다 */
async function RequestBlock() {
  const stamp = await getRequestStamp()
  return (
    <p data-demo-marker="probe-request" data-request-id={stamp.id}>
      ③ 요청 시점 결과 #{stamp.id} (생성 {stamp.at}, 지연 {REQUEST_DELAY_MS}ms)
    </p>
  )
}
