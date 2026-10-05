import { DETAIL_DELAY_MS } from '../lib/constants'

/** params(URL 데이터)에 의존하는 영역. 요청 시점에 해결되므로 Suspense 안에서만 읽는다. */
export async function Detail({ params, kind }: { params: Promise<{ id: string }>; kind: string }) {
  const { id } = await params
  await new Promise((resolve) => setTimeout(resolve, DETAIL_DELAY_MS))
  return (
    <p data-demo-marker="detail" data-detail-id={id} className="font-mono">
      URL별 영역 — {kind}/[id] 의 id = {id}
    </p>
  )
}
