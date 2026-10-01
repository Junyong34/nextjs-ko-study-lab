import { NextRequest, NextResponse } from 'next/server'
import { MAX_DELAY_MS } from '../../types'

export const dynamic = 'force-dynamic'

/**
 * 외부 PG사를 대신하는 "진짜" JS 응답. 이름(name)에 따라 다른 스크립트를 내려준다.
 * - name=sdk    : window.PgSdk(결제 SDK 본체)를 정의한다.
 * - name=plugin : SDK가 이미 있어야만 성공하는 결제 위젯 플러그인. 실행 순간의 결과를 window.PgWidget에 기록한다.
 * - name=probe  : strategy별 실행 시각 측정용. window.__pgProbe[id]에 executedAt을 남긴다.
 * ?delay=ms 는 응답을 서버에서 실제로 지연시키고, ?fail=500 은 실제 HTTP 500으로 응답해 <script>의 error 이벤트를 일으킨다.
 */
const SCRIPTS: Record<string, (id: string) => string> = {
  sdk: () => `(function () {
  var seq = 0;
  window.PgSdk = {
    version: '2.0.0-local',
    executedAt: performance.now(),
    widgets: [],
    registerWidget: function (name) { this.widgets.push(name); return this.widgets.length; },
    requestPay: function (req) {
      seq += 1;
      return { paymentKey: 'pay_' + seq + '_' + Math.random().toString(36).slice(2, 8), orderName: req.orderName, amount: req.amount, at: performance.now() };
    }
  };
})();
`,
  plugin: () => `(function () {
  var record = { executedAt: performance.now(), sdkPresent: typeof window.PgSdk !== 'undefined', ok: false };
  try {
    window.PgSdk.registerWidget('card');
    record.ok = true;
  } catch (e) {
    record.error = e.name + ': ' + e.message;
  }
  window.PgWidget = record;
})();
`,
  probe: (id) => `(window.__pgProbe = window.__pgProbe || {})[${JSON.stringify(id)}] = { executedAt: performance.now() };
`,
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const build = SCRIPTS[params.get('name') ?? 'sdk']
  if (!build) return new NextResponse('/* unknown script name */', { status: 404 })

  const rawDelay = Number(params.get('delay') ?? 0)
  const delayMs = Number.isFinite(rawDelay) ? Math.min(Math.max(Math.trunc(rawDelay), 0), MAX_DELAY_MS) : 0
  if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs))

  const headers = { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' }
  if (params.get('fail')) {
    return new NextResponse('/* PG SDK: HTTP 500 (의도된 장애 응답) */', { status: 500, headers })
  }
  return new NextResponse(build(params.get('id') ?? ''), { headers })
}
