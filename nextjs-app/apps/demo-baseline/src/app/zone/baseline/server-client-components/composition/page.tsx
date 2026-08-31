import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ProductSpecsServer } from './components/ProductSpecsServer'
import { CompositionInteractiveSection } from './components/CompositionInteractiveSection'
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
        title="Server & Client Components 합성 패턴 & 번들 최적화"
        concept="Next.js Server Component(RSC)에서 상세 스펙을 서버 렌더링하고, 클릭 인터랙션이 필요한 말단 버튼만 'use client'(RCC)로 격리하여 번들 크기를 최적화합니다."
        steps={[
          {
            step: 1,
            title: '서버 렌더링 스펙(RSC) 확인',
            description: '미드솔 폼, 탄소섬유 플레이트 등 상세 제원이 서버에서 렌더링되어 표시된 것을 확인합니다.',
            actionBadge: 'RSC 확인',
          },
          {
            step: 2,
            title: '[위시리스트 담기] 버튼 클릭',
            description: '하단의 [위시리스트 담기] 버튼을 클릭하여 클라이언트 로컬 상태(useState)가 독립 동작하는 것을 확인합니다.',
            actionBadge: 'RCC 인터랙션',
          },
          {
            step: 3,
            title: '합성 경계 및 상태 동기화 관찰',
            description: '전체 페이지를 클라이언트로 변환하지 않고도 말단 버튼의 좋아요 카운트(142 → 143)가 즉시 갱신되는 것을 관찰합니다.',
            actionBadge: '번들 최적화',
            observe: '위시리스트 카운트가 142에서 143으로 증가하고 [찜 완료] 뱃지로 전환되며, 상단 서버 스펙 영역은 보존됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단, 3단, 4단: 실습 조작 영역 및 검증/개념정리 */}
      <CompositionInteractiveSection
        productId={product.id}
        productName={product.name}
        productPrice={product.price}
      >
        {/* 1) Server Component: 서버에서만 렌더링되는 상세 제원 */}
        <ProductSpecsServer product={product} />
      </CompositionInteractiveSection>
    </DemoContainer>
  )
}
