import React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InheritanceInspector } from '../../components/InheritanceInspector'
import { VerificationFooter } from '../../components/VerificationFooter'
import { PRODUCTS, findProduct, BASE_PATH } from '../../types'

interface ProductPageProps {
  params: Promise<{ productId: string }>
}

// parent: ResolvingMetadata — 상위 세그먼트(../../layout.tsx → 루트 layout.tsx)가
// 정의한 metadata를 비동기로 읽는다. 여기서는 title과 alternates.canonical만 반환하고
// openGraph는 아예 반환하지 않는다 — Next.js는 같은 키를 다시 정의하지 않으면 가장 가까운
// 조상의 값을 그대로 상속하므로, ../../layout.tsx의 openGraph가 교체 없이 그대로 남는다.
export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { productId } = await params
  const product = findProduct(productId)
  if (!product) return {}

  // await parent로 상위 layout.tsx가 실제로 해석한 openGraph.siteName을 서버에서 읽는다.
  // 검증 UI는 이 서버 계산값과 브라우저가 실제로 렌더링한 <head> DOM 값을 대조한다.
  const parentOpenGraph = (await parent).openGraph

  return {
    title: product.title,
    alternates: {
      canonical: `${BASE_PATH}/products/${product.id}`,
    },
    other: {
      'x-demo-parent-og-site-name': parentOpenGraph?.siteName ?? '(없음)',
    },
  }
}

export default async function ProductInheritancePage({ params }: ProductPageProps) {
  const { productId } = await params
  const product = findProduct(productId)
  if (!product) notFound()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="자식 페이지의 title/canonical 오버라이드 관찰"
        concept={`지금 이 페이지(/products/${product.id})의 generateMetadata는 title과 alternates.canonical만 반환하고 openGraph는 반환하지 않습니다. 아래 인스펙터에서 canonical과 title은 바뀌었지만 og:site_name/og:image는 상위 layout.tsx 값 그대로인지 확인하세요.`}
        steps={[
          {
            step: 1,
            title: '실제 <head> 인스펙터에서 현재 값 확인',
            description: `현재 상품(${product.name})의 title/canonical이 실제로 바뀌었는지, og:site_name/og:image는 상위 layout.tsx 선언값과 같은지 확인합니다.`,
            actionBadge: '자식 오버라이드 확인',
          },
          {
            step: 2,
            title: '다른 [상품 프리셋] 또는 [인덱스로 돌아가기]로 이동',
            description: '다른 상품으로 이동해 canonical/title만 다시 바뀌고 og:site_name/og:image는 그대로인지, 인덱스로 돌아가면 og:site_name이 아예 사라지는지 대조합니다.',
            actionBadge: '상속·교체 대조',
            observe: 'canonical·title은 상품마다 바뀌지만 og:site_name·og:image는 두 상품에서 완전히 동일함(상속) — 인덱스로 돌아가면 og:site_name이 사라짐(교체)',
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title="상품 상세 페이지 (parent 상속 실습)">
        <InheritanceInspector products={PRODUCTS} activeProductId={product.id} />
      </DemoPlaygroundCard>
      <VerificationFooter activeProductId={product.id} />
    </DemoContainer>
  )
}
