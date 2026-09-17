import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'directives/use-client/boundary-declaration')

import Link from 'next/link'

export default function BoundaryHubPage() {
  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-zinc-600 dark:text-zinc-400">
        이 화면(<code>page.tsx</code>)은 파일 최상단에 <code>&apos;use client&apos;</code>가 없는 실제{' '}
        <strong>Server Component</strong>입니다. 아래 두 링크를 눌러 실제 라우트를 이동하며, 같은 형태의{' '}
        <code>onClick</code> 핸들러가 어느 쪽 파일에서만 동작하는지 직접 비교하세요.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/zone/baseline/directives/use-client/boundary-declaration/server-attempt"
          className="block rounded-lg border border-rose-300 bg-rose-50/60 p-3 transition hover:bg-rose-100/70 dark:border-rose-900/60 dark:bg-rose-950/20"
        >
          <div className="font-bold text-rose-800 dark:text-rose-300">① 서버 컴포넌트에서 onClick 시도 →</div>
          <div className="mt-1 text-zinc-600 dark:text-zinc-400">server-attempt/page.tsx — &apos;use client&apos; 없음</div>
        </Link>
        <Link
          href="/zone/baseline/directives/use-client/boundary-declaration/client-attempt"
          className="block rounded-lg border border-emerald-300 bg-emerald-50/60 p-3 transition hover:bg-emerald-100/70 dark:border-emerald-900/60 dark:bg-emerald-950/20"
        >
          <div className="font-bold text-emerald-800 dark:text-emerald-300">② 클라이언트 컴포넌트에서 onClick 시도 →</div>
          <div className="mt-1 text-zinc-600 dark:text-zinc-400">client-attempt/page.tsx — &apos;use client&apos; 있음</div>
        </Link>
      </div>
    </div>
  )
}
