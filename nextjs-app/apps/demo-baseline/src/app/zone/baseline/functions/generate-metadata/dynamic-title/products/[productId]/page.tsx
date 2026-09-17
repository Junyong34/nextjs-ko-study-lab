import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DynamicTitleInspector } from '../../components/DynamicTitleInspector'
import { VerificationFooter } from '../../components/VerificationFooter'
import { PRODUCTS, findProduct } from '../../types'

interface ProductPageProps {
  params: Promise<{ productId: string }>
}

// 동적 generateMetadata({ params }) — params.productId로 실제 데이터를 조회해
// 상품마다 다른 title/description을 서버에서 진짜로 생성한다.
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params
  const product = findProduct(productId)
  if (!product) return {}

  return {
    title: product.title,
    description: product.description,
  }
}

export default async function ProductDynamicTitlePage({ params }: ProductPageProps) {
  const { productId } = await params
  const product = findProduct(productId)
  if (!product) notFound()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="generateMetadata({ params }) 실행 결과 확인"
        concept={`지금 이 페이지는 params.productId="${product.id}"를 받아 generateMetadata가 서버에서 실행되어 만든 실제 title/description을 쓰고 있습니다. 아래 <head> 인스펙터에서 상품마다 다른 실제 값을 확인하세요.`}
        steps={[
          {
            step: 1,
            title: "실제 <head> 인스펙터로 현재 값 확인",
            description: `현재 상품(${product.name})의 title/description이 실제 document.title / meta 태그에 반영됐는지 확인합니다.`,
            actionBadge: "동적 메타 확인",
          },
          {
            step: 2,
            title: "다른 [상품 프리셋]으로 이동",
            description: "다른 상품을 클릭해 실제로 페이지를 이동하고, generateMetadata가 다시 실행되어 값이 바뀌는지 관찰합니다.",
            actionBadge: "재실행 관찰",
            observe: "상품을 바꿔 이동할 때마다 실제 <head> 인스펙터의 값이 서버에서 다시 계산되어 바뀜",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title="상품 상세 generateMetadata 실습">
        <DynamicTitleInspector products={PRODUCTS} activeProductId={product.id} />
      </DemoPlaygroundCard>
      <VerificationFooter products={PRODUCTS} activeProductId={product.id} />
    </DemoContainer>
  )
}
