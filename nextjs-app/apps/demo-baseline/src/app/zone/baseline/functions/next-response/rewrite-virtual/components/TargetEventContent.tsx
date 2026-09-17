import Link from 'next/link'
import { ROOT_PATH, type RouteAccessMode } from '../types'

const MODE_BADGE: Record<RouteAccessMode, string> = {
  rewrite: 'rewrite로 도착 (주소창 유지)',
  redirect: 'redirect로 도착 (주소창 변경)',
  direct: '직접 접근',
}

export function TargetEventContent({ mode }: { mode: RouteAccessMode }) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">2026 여름 시즌오프 세일 이벤트</h4>
          <p className="text-xs text-zinc-500">
            <code>target-event/page.tsx</code> — 방금 실제로 렌더링된 서버 콘텐츠입니다.
          </p>
        </div>
        <span className="rounded bg-zinc-900 px-2 py-0.5 text-[11px] font-mono font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {MODE_BADGE[mode]}
        </span>
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300">
        전 품목 최대 50% 할인 · 프리미엄 러닝화 외 128종 — 이 카드 문구는 어떤 경로로 왔든(rewrite/redirect/직접 접근)
        항상 이 하나의 실제 파일에서 렌더링됩니다. 지금 화면이 다른 파일처럼 보인다면 그건 착시가 아니라, 아래
        [검증] 패널의 <code>usePathname()</code> 값이 알려주는 실제 브라우저 주소가 다르기 때문입니다.
      </div>

      <Link
        href={ROOT_PATH}
        className="inline-block rounded bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        ← 실습 페이지로 돌아가기
      </Link>
    </div>
  )
}
