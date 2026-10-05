import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DemoContainer, DemoPlaygroundCard } from '@study/demo-kit'
import { BASE_PATH, DETAIL_DELAY_MS } from '../../constants'
import { findProductSummary, getProductDetail } from '../../data'
import { BodySkeleton, DetailBody, SummaryHeader } from '../../components/ProductView'
import { DirectVerification } from '../../components/DirectVerification'

type Props = { params: Promise<{ id: string }> }

/** 정식 페이지에만 있다 — 서버가 상품명으로 <title>·description·OG를 만든다(검색 봇·공유 미리보기용). */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = findProductSummary(id)
  if (!product) return { title: '상품을 찾을 수 없음' }

  const description = `${product.category} · ${product.price.toLocaleString()}원`
  return {
    title: product.name,
    description,
    openGraph: { title: product.name, description },
  }
}

/** Suspense 안에서 느린 상세 조회를 기다린다. 이 컴포넌트가 끝나면 본문 HTML이 이어서 스트리밍된다. */
async function ProductDetailLoader({ id }: { id: string }) {
  const detail = await getProductDetail(id)
  if (!detail) notFound()
  return <DetailBody detail={detail} />
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = findProductSummary(id)
  if (!product) notFound()

  return (
    <DemoContainer className="space-y-6">
      <DemoPlaygroundCard title={`정식 페이지 (products/${id}/page.tsx)`}>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              정식 페이지 (가로채기 아님)
            </span>
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
            >
              ← 목록으로
            </Link>
          </div>

          <SummaryHeader summary={product} />
          <Suspense
            fallback={
              <BodySkeleton label={`상세를 서버에서 조회하는 중입니다 (학습용 지연 ${DETAIL_DELAY_MS / 1000}초) — 이 스켈레톤이 먼저 도착합니다`} />
            }
          >
            <ProductDetailLoader id={id} />
          </Suspense>
        </div>
      </DemoPlaygroundCard>

      <DirectVerification productName={product.name} />
    </DemoContainer>
  )
}
