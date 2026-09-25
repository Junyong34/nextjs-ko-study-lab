import { runEdgeChecks } from '../edge-checks'

// 이 Route Handler 세그먼트를 Edge Runtime으로 실행한다.
// (Next.js 16에서 'edge'는 deprecated — next build가 경고를 출력하지만 여전히 동작한다)
export const runtime = 'edge'

export async function GET(request: Request) {
  const body = await runEdgeChecks(request)
  return Response.json(body, { headers: { 'Cache-Control': 'no-store' } })
}
