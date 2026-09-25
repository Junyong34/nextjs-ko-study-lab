import type { ReactNode } from 'react'

/**
 * app/.../shop-vs-admin-roots/(admin)/layout.tsx
 *
 * (shop)/layout.tsx와 같은 이유로 이 파일도 <html>/<body>를 선언하지 않는다.
 * 대신 관리자 콘솔 셸(다크 사이드바)만 (shop)과 완전히 다른 디자인·내비게이션으로
 * 구현해, 두 그룹이 실제로 서로 다른 레이아웃 트리를 갖는다는 것을 보여준다.
 */
export default function AdminGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[420px] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      <aside className="w-36 shrink-0 border-r border-zinc-800 bg-zinc-900 px-3 py-3">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-violet-600 text-[11px] font-bold text-white">
            A
          </span>
          <span className="text-xs font-bold text-zinc-100">Admin</span>
        </div>
        <nav className="space-y-1 text-[11px] font-medium text-zinc-400">
          <div className="rounded bg-violet-600/20 px-2 py-1.5 text-violet-300">대시보드</div>
          <div className="rounded px-2 py-1.5">주문 관리</div>
          <div className="rounded px-2 py-1.5">상품 관리</div>
          <div className="rounded px-2 py-1.5">정산</div>
        </nav>
      </aside>
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}
