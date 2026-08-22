import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProductSpecsServer } from './components/ProductSpecsServer'
import { WishlistButtonClient } from './components/WishlistButtonClient'
import { VerificationFooter } from './components/VerificationFooter'
import type { ProductDetail } from './types'

// 서버에서만 실행되는 데이터 로딩 시뮬레이션
async function getProductDetail(): Promise<ProductDetail> {
  const now = new Date()
  const renderedAt = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })

  return {
    id: 'prod-nike-alpha',
    name: '나이키 알파플라이 3 프리미엄',
    price: 329000,
    renderedAt,
    specs: [
      { label: '미드솔 폼', value: '전장 ZoomX 폼 (최대 에너지 리턴)' },
      { label: '탄소섬유 플레이트', value: 'Flyplate 일체형 탄소 섬유' },
      { label: '갑피 소재', value: 'Atomknit 3.0 초경량 통기성 원단' },
      { label: '무게', value: '218g (270mm 기준 초경량)' },
      { label: '드롭(오프셋)', value: '8mm (힐 40mm / 포어풋 32mm)' },
      { label: '제조국', value: '베트남 / 한국 공식 수입 정품' },
    ],
    serverSecretNote: '[보안] DB 서버 직접 쿼리 (클라이언트 미노출)',
  }
}

export default async function CompositionDemoPage() {
  const product = await getProductDetail()

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Server & Client Components 합성 및 경계 분리"
        concept="Next.js App Router는 기본적으로 모든 컴포넌트가 Server Component(RSC)입니다. 무거운 데이터와 정적 UI는 서버에서 렌더링하고, 클릭/상태가 필요한 말단 버튼만 Client Component('use client')로 격리하여 번들 크기를 극소화합니다."
        steps={[
          {
            step: 1,
            title: '서버 렌더링 스펙 확인',
            description: '상세 제원 영역이 서버에서 렌더링되어 0 KB JS 번들로 내려온 것을 확인합니다.',
            actionBadge: 'RSC 렌더링',
          },
          {
            step: 2,
            title: '위시리스트 하트 클릭',
            description: '하단의 찜하기 버튼을 눌러 클라이언트 로컬 상태(useState)가 독립 동작하는 것을 봅니다.',
            actionBadge: 'RCC 인터랙션',
          },
          {
            step: 3,
            title: '합성 구조 대조',
            description: '전체 페이지를 클라이언트로 만들지 않고도 완벽한 인터랙티비티를 구현함을 대조합니다.',
            actionBadge: '번들 최적화 달성',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="상품 상세 뷰 (RSC 본문 + RCC 찜 버튼 합성)" className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {product.name}
            </h3>
            <div className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {product.price.toLocaleString()}원
            </div>
          </div>
          <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Server-Client Hybrid View
          </span>
        </div>

        {/* 1) Server Component: 서버에서만 렌더링되는 상세 제원 */}
        <ProductSpecsServer product={product} />

        {/* 2) Client Component: 클라이언트에서 Hydrate되는 위시리스트 버튼 */}
        <WishlistButtonClient productId={product.id} />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
