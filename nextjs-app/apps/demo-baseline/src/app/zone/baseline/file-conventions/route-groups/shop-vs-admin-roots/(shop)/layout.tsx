import type { ReactNode } from 'react'

/**
 * app/.../shop-vs-admin-roots/(shop)/layout.tsx
 *
 * 이 폴더 위에는 이미 apps/demo-baseline/src/app/layout.tsx가 <html>/<body>를
 * 정의하고 있어, 이 layout.tsx는 Next.js가 말하는 "root layout"이 될 수 없다
 * (공식 정의: layout.js 위에 다른 layout.js가 없어야 root layout). 그래서 여기서는
 * <html>/<body>를 선언하지 않고, 고객용 쇼핑몰 셸(GNB·카트)만 실제로 구현한다.
 * 최상위에서 진짜 두 번째 루트로 만드는 참고 코드는 이 실습 3단 검증의
 * 개념 정리 카드에 있다.
 */
export default function ShopGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[420px] rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-[11px] font-bold text-white">
            S
          </span>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Nova Store</span>
        </div>
        <nav className="flex items-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <span className="text-blue-700 dark:text-blue-400">상품</span>
          <span>주문 내역</span>
          <span>고객센터</span>
          <span className="rounded border border-blue-200 px-2 py-0.5 text-blue-700 dark:border-blue-900 dark:text-blue-400">
            장바구니 2
          </span>
        </nav>
      </header>
      <div className="p-4">{children}</div>
    </div>
  )
}
