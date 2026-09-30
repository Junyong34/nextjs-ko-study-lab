import { parseTarget, probeFs } from '../probe'

// Node.js Runtime(기본값)을 명시한다. fs 같은 Node 내장 모듈을 쓸 수 있다.
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const body = await probeFs(parseTarget(request))
  return Response.json(body, { headers: { 'Cache-Control': 'no-store' } })
}
