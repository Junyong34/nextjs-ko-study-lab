import { NextRequest, NextResponse } from 'next/server'
import { SCRIPT_LOADED_EVENT, STRATEGY_ORDER } from '../types'

export const dynamic = 'force-dynamic'

/**
 * next/script의 각 strategy가 실제로 로드하는 최소 프로브 스크립트.
 * 로드 순서를 하드코딩해 보여주지 않고, 브라우저가 이 파일을 실제로 실행한 순간의
 * performance.now()/document.readyState만 커스텀 이벤트로 방출한다.
 */
export async function GET(request: NextRequest) {
  const strategyParam = request.nextUrl.searchParams.get('strategy')
  const strategy = (STRATEGY_ORDER as string[]).includes(strategyParam ?? '') ? strategyParam : 'unknown'

  const body = `(function () {
  var detail = { strategy: ${JSON.stringify(strategy)}, loadedAt: performance.now(), readyState: document.readyState };
  window.dispatchEvent(new CustomEvent(${JSON.stringify(SCRIPT_LOADED_EVENT)}, { detail: detail }));
})();
`

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/javascript; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
