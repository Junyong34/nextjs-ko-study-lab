import { collectRuntimeProbe } from '../probe'

// Next.js 16에서 'edge'는 deprecated — next build가 경고를 출력한다(데모의 관찰 대상).
export const runtime = 'edge'

// 세 핸들러(default/node/edge)의 본문은 한 글자도 다르지 않다. 차이는 위 runtime 선언뿐이다.
export function GET() {
  return Response.json(collectRuntimeProbe(), {
    headers: { 'Cache-Control': 'no-store' },
  })
}
