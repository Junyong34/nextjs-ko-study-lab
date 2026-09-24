import { NextRequest, NextResponse } from 'next/server'
import { SDK_MAX_DELAY_MS } from '../types'

export const dynamic = 'force-dynamic'

/**
 * 외부 PG사 결제 SDK를 대신하는 "진짜" 로컬 JS 파일.
 * - ?delay=ms : 응답을 서버에서 실제로 지연시킨다(최대 5000ms).
 * - ?fail=500|404 (또는 fail=1 → 500) : 실제 HTTP 오류 status로 응답해 브라우저 <script>의 error 이벤트를 일으킨다.
 * 성공 응답은 실행되는 순간 window.DemoPay 전역 객체를 정의한다. 콜백 호출 여부·시각은 전부 브라우저가 실제로 보고한다.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const rawDelay = Number(params.get('delay') ?? 0)
  const delayMs = Number.isFinite(rawDelay) ? Math.min(Math.max(Math.trunc(rawDelay), 0), SDK_MAX_DELAY_MS) : 0

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  const fail = params.get('fail')
  if (fail) {
    const status = fail === '404' ? 404 : 500
    return new NextResponse(`/* DemoPay SDK: HTTP ${status} (의도된 장애 응답) */`, {
      status,
      headers: { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  }

  const servedAt = new Date().toISOString()
  const body = `(function () {
  var prev = window.DemoPay;
  var instanceSeq = 0;
  window.DemoPay = {
    version: '1.0.0-local',
    servedAt: ${JSON.stringify(servedAt)},
    delayMs: ${delayMs},
    executedAt: performance.now(),
    executionCount: (prev && prev.executionCount ? prev.executionCount : 0) + 1,
    init: function (opts) {
      if (!opts || !opts.clientKey) throw new Error('DemoPay.init: clientKey가 필요합니다');
      instanceSeq += 1;
      var id = instanceSeq;
      return {
        instanceId: id,
        clientKey: opts.clientKey,
        createdAt: performance.now(),
        requestPayment: function (req) {
          return { instanceId: id, orderName: req.orderName, amount: req.amount, requestedAt: performance.now() };
        }
      };
    }
  };
})();
`

  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
