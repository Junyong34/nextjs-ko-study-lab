import { getRequestStamp, REQUEST_DELAY_MS } from '../lib/stamps'

/**
 * 대조용 라우트: probe와 같은 요청 시점 데이터를 <Suspense> 없이 await한다.
 * cacheComponents: true에서는 이렇게 쓰면 "uncached data during prerendering" 오류가 나고
 * next build가 실패한다. 아래 export로 정적 셸을 포기한다고 명시해야만 허용된다.
 * (instant는 cacheComponents가 켜진 경우에만 동작하는 세그먼트 설정이다)
 */
export const instant = false

export default async function EnableFlagBlockingPage() {
  const stamp = await getRequestStamp()
  return (
    <main className="space-y-2 p-6 font-mono text-xs">
      <p data-demo-marker="probe-static">① 정적 마크업 — 하지만 아래 데이터가 끝날 때까지 함께 막힌다</p>
      <p data-demo-marker="probe-request" data-request-id={stamp.id}>
        ③ 요청 시점 결과 #{stamp.id} (생성 {stamp.at}, 지연 {REQUEST_DELAY_MS}ms)
      </p>
    </main>
  )
}
