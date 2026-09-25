import { getMyOrders } from '../queries'
import { viewerName, type RouteView } from '../types'
import { VisitReporter } from './VisitReporter'

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`

/** 서버 컴포넌트: 'use cache: private' 함수를 호출하고 반환값을 그대로 그린다. */
export async function PrivateOrdersPanel({ route }: { route: RouteView }) {
  const snapshot = await getMyOrders()

  return (
    <section data-testid={`private-panel-${route}`} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-purple-200 bg-purple-50/60 px-3 py-2 font-mono text-[11px] dark:border-purple-900/60 dark:bg-purple-950/20">
        <span className="font-sans text-xs font-semibold text-purple-950 dark:text-purple-200">
          {viewerName(snapshot.viewer)}님의 {route === 'orders' ? '주문 내역' : '배송 현황'}
        </span>
        <span data-testid="snapshot" className="text-purple-800 dark:text-purple-300">
          cacheId <strong data-testid="cache-id">#{snapshot.cacheId}</strong> · 본문 실행{' '}
          <span data-testid="generated-at">{snapshot.generatedAt}</span> · 이 사용자 서버 실행{' '}
          <span data-testid="exec-no">{snapshot.execNoForViewer}</span>번째 · cookie=
          <span data-testid="cookie-value">{snapshot.cookieValue ?? '(없음)'}</span>
        </span>
      </div>

      {snapshot.orders.length === 0 ? (
        <p className="rounded-md border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-500 dark:border-zinc-700">
          로그인 쿠키가 없어 개인화 데이터가 비어 있습니다. 위에서 사용자를 선택하세요.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100 rounded-md border border-zinc-200 text-xs dark:divide-zinc-800 dark:border-zinc-800">
          {snapshot.orders.map((o) => (
            <li key={o.orderId} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
              <span className="min-w-0 flex-1 truncate">
                <span className="mr-2 font-mono text-zinc-500">{o.orderId}</span>
                <span className="text-zinc-900 dark:text-zinc-100">{o.productName}</span>
              </span>
              {route === 'orders' ? (
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{won(o.price)}</span>
              ) : (
                <span className="font-mono text-zinc-600 dark:text-zinc-400">
                  {o.status} · 운송장 {o.trackingNo}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      <VisitReporter route={route} snapshot={snapshot} />
    </section>
  )
}

export function PanelSkeleton() {
  return <div className="h-44 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900" />
}
