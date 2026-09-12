import React from 'react'
import Link from 'next/link'
import { DemoContainer } from '@study/demo-kit'
import { TRIGGER_404_BASE_PATH } from '../types'
import { StatusCodeVerifier } from '../components/StatusCodeVerifier'

export default function StoreNotFound() {
  return (
    <DemoContainer className="space-y-4">
      <div className="space-y-4 rounded-lg border-2 border-amber-500/40 bg-amber-50/40 p-6 text-center dark:border-amber-900/50 dark:bg-amber-950/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-600 dark:bg-amber-900/50 dark:text-amber-300">
          404
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            존재하지 않거나 폐점한 매장입니다 (stores/not-found.tsx)
          </h4>
          <p className="text-xs text-zinc-500">
            page.tsx가 아니라 <code>stores/[storeId]/layout.tsx</code>에서 <code>notFound()</code>가 호출되어 이
            바운더리가 렌더링되었습니다. not-found.tsx는 그 layout.tsx의 <em>바깥쪽</em>(부모 세그먼트인 stores)에
            있어야 잡을 수 있습니다 — 같은 폴더에 두면 layout.tsx 자신이 던진 예외를 자기 안의 not-found.tsx가
            잡지 못합니다.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href={TRIGGER_404_BASE_PATH}
            className="rounded bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            ← 데모로 돌아가기
          </Link>
        </div>
      </div>

      <StatusCodeVerifier />
    </DemoContainer>
  )
}
