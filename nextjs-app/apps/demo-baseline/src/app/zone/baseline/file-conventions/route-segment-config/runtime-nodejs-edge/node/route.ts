import { collectRuntimeProbe } from '../probe'

export const runtime = 'nodejs'

// 세 핸들러(default/node/edge)의 본문은 한 글자도 다르지 않다. 차이는 위 runtime 선언뿐이다.
export function GET() {
  return Response.json(collectRuntimeProbe(), {
    headers: { 'Cache-Control': 'no-store' },
  })
}
