import { notFound } from 'next/navigation'
import { isPrefetchMode } from '../../../catalog'
import { countRender } from '../../../lib/render-counter'

// 이 레이아웃은 loading.tsx보다 바깥에 있다. 따라서 기본 prefetch(loading 경계까지)와
// prefetch={true}(전체) 모두 이 함수를 서버에서 실행한다 — 공식 가이드 Troubleshooting의
// "prefetch 중에도 layout/page의 부수 효과가 실행된다"를 카운터로 관찰하는 지점이다.
export default async function ItemLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ mode: string; sku: string }>
}) {
  const { mode, sku } = await params
  if (!isPrefetchMode(mode)) notFound()
  countRender(mode, 'layout')

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6 font-sans text-sm">
      <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
        catalog / {mode} / {sku}
      </p>
      {children}
    </div>
  )
}
