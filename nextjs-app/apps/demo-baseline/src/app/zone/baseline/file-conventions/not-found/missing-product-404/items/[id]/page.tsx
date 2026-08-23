import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../../components/VerificationFooter'

const VALID_PRODUCTS: Record<string, { name: string; price: number }> = {
  'PROD-101': { name: '정상 등록 상품: 프리미엄 러닝화', price: 129000 },
  'PROD-102': { name: '정상 등록 상품: 윈드브레이커', price: 189000 },
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const BASE_PATH = '/zone/baseline/file-conventions/not-found/missing-product-404'

  const product = VALID_PRODUCTS[id]

  // 유효하지 않은 상품 ID인 경우 Next.js 표준 notFound() 실행 -> not-found.tsx 렌더링
  if (!product) {
    notFound()
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={`정상 상품 페이지: ${product.name}`}
        concept="유효한 상품 ID로 접근 시 정상 화면이 렌더링되며, 잘못된 ID 접근 시 notFound()가 발동합니다."
        steps={[
          {
            step: 1,
            title: "상품 ID 확인",
            description: `ID "${id}"가 DB에 유효하게 존재하여 200 OK 페이지가 마운트되었습니다.`,
            actionBadge: "정상 ID",
          },
          {
            step: 2,
            title: "404 notFound() 트리거 테스트",
            description: "존재하지 않는 상품 ID 링크를 클릭하여 not-found.tsx 렌더링을 확인합니다.",
            actionBadge: "404 테스트",
          },
        ]}
      />

      <DemoPlaygroundCard title={`상품 정보 (ID: ${id})`}>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100">{product.name}</h5>
              <p className="text-xs text-zinc-500">정상 상품 데이터가 바인딩되었습니다.</p>
            </div>
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            >
              ← 목록으로 복귀
            </Link>
          </div>

          <div className="flex justify-between items-center font-mono text-xs">
            <span>판매가:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {product.price.toLocaleString()}원
            </span>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter isValidProduct={true} productId={id} />
    </DemoContainer>
  )
}
