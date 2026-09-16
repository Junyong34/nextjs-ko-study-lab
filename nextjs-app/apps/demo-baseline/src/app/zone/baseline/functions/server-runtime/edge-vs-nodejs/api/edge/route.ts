import { buildRuntimeProbeResponse } from '../../runtime-probe'

// route segment config: 이 라우트 세그먼트를 Edge 런타임으로 렌더링한다.
// (Next.js 16.3.2 기준 Edge Runtime은 deprecated 상태지만, 여전히 동작한다 — 개념 정리 참고)
export const runtime = 'edge'

export async function GET() {
  const body = await buildRuntimeProbeResponse('edge')
  return Response.json(body)
}
