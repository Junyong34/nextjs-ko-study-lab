import type { SpansResponse } from '../types'
import { getSpanStore } from '../lib/span-store'

const NO_STORE = { 'Cache-Control': 'no-store' }

// 링버퍼에서 traceId(쉼표로 여러 개)에 해당하는 span만 골라 돌려준다.
export async function GET(request: Request) {
  const ids = (new URL(request.url).searchParams.get('traceId') ?? '').split(',').filter(Boolean)
  const store = getSpanStore()
  const body: SpansResponse = {
    installed: Boolean(store),
    limit: store?.limit ?? 0,
    total: store?.spans.length ?? 0,
    droppedCount: store?.droppedCount ?? 0,
    trackedTraceCount: store?.trackedTraceIds.length ?? 0,
    spans: store ? store.spans.filter((s) => ids.includes(s.traceId)) : [],
  }
  return Response.json(body, { headers: NO_STORE })
}

// 초기화 API: 링버퍼와 추적 대상 trace 목록을 비운다(provider·fetch 계측은 그대로 둔다).
export async function DELETE() {
  const store = getSpanStore()
  const cleared = store?.spans.length ?? 0
  if (store) {
    store.spans.length = 0
    store.trackedTraceIds.length = 0
    store.droppedCount = 0
  }
  return Response.json({ cleared }, { headers: NO_STORE })
}
