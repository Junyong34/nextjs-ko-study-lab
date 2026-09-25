import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/intercepting-routes/direct-vs-modal/target/[id]',
)

import React from 'react'
import Link from 'next/link'
import { DemoContainer, DemoPlaygroundCard } from '@study/demo-kit'
import { NavigationVerification } from '../../components/NavigationVerification'
import { getTargetItem } from '../../target-items'

const GALLERY_PATH = '/zone/baseline/file-conventions/intercepting-routes/direct-vs-modal'

export default async function DirectTargetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = getTargetItem(id)

  return (
    <DemoContainer className="space-y-6">
      <DemoPlaygroundCard title={`전체 페이지 (target/${id}/page.tsx)`}>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                <span className="rounded bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  전체 페이지 렌더 (인터셉트 아님)
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                {item.category} · 항목 ID: {id}
              </p>
            </div>
            <Link
              href={GALLERY_PATH}
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
            >
              ← 갤러리로 돌아가기
            </Link>
          </div>

          <div
            className={`flex h-48 w-full items-center justify-center rounded-lg bg-gradient-to-br p-6 text-center text-white ${item.color}`}
          >
            <div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-1 font-mono text-xs opacity-90">STANDALONE FULL PAGE ROUTE (target/[id])</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">{item.category}</span>
            <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
              {item.price.toLocaleString()}원
            </span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">{item.desc}</p>

          <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              갤러리에서 <code>{'<Link>'}</code>로 이 경로에 진입하면{' '}
              <code>@modal/(.)target/[id]/page.tsx</code>가 가로채어 모달로 표시하지만, 이 화면은 새 탭
              직접 진입 또는 새로고침으로 도달했으므로 <code>target/[id]/page.tsx</code>가 그대로
              렌더링됩니다.
            </p>
          </div>
        </div>
      </DemoPlaygroundCard>

      <NavigationVerification mode="direct" itemId={id} />
    </DemoContainer>
  )
}
