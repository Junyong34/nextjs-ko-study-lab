import { buildRuntimeProbeResponse } from '../../runtime-probe'

// route segment config: 이 라우트 세그먼트를 Node.js 런타임으로 렌더링한다 (기본값과 동일).
export const runtime = 'nodejs'

export async function GET() {
  const body = await buildRuntimeProbeResponse('nodejs')
  return Response.json(body)
}
