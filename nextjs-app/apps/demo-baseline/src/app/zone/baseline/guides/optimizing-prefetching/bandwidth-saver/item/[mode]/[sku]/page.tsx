import Link from 'next/link'
import { connection } from 'next/server'
import { notFound } from 'next/navigation'
import { BASE_PATH, isPrefetchMode } from '../../../catalog'
import { countRender } from '../../../lib/render-counter'

export default async function ItemPage({ params }: { params: Promise<{ mode: string; sku: string }> }) {
  // connection()으로 이 라우트를 요청 시점 렌더링(동적 라우트)으로 고정한다.
  // 정적 라우트였다면 기본 prefetch도 전체 페이지를 가져가 모드 간 차이가 사라진다.
  await connection()
  const { mode, sku } = await params
  if (!isPrefetchMode(mode)) notFound()
  countRender(mode, 'page')

  const renderedAt = new Date().toLocaleTimeString('ko-KR', { hour12: false })
  const seed = Number(sku.slice(4))

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100">상품 {sku}</h1>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        가격 {(9_900 + seed * 1_000).toLocaleString('ko-KR')}원 · 서버 렌더 시각 {renderedAt}
      </p>
      <p className="text-xs text-zinc-500">
        이 page.tsx는 <code>{mode}</code> 모드 링크로 진입했습니다. 서버 카운터의 page 값이 요청마다 1씩 오릅니다.
      </p>
      <Link href={BASE_PATH} className="inline-block text-xs font-medium text-zinc-900 underline dark:text-zinc-100">
        카탈로그로 돌아가기
      </Link>
    </div>
  )
}
