import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ReviewsStreamingClient } from './components/ReviewsStreamingClient'

// 1. 메인 상품 정보: 서버에서 즉시 로드 (빠른 FCP)
async function getProductInfo() {
  return {
    id: 'stream-keyboard-01',
    name: '커스텀 87키 알루미늄 가스켓 기계식 키보드',
    price: 189000,
    desc: 'CNC 풀 알루미늄 하우징, 가스켓 마운트 구조, 핫스왑 지원 하이엔드 키보드',
  }
}

export default async function UsePromiseStreamingDemoPage() {
  const product = await getProductInfo()

  return (
    <DemoContainer className="space-y-8">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="React 19 use(Promise) & Suspense 점진적 스트리밍"
        concept="React 19의 use() Hook은 Promise 객체를 직접 언랩(unwrap)하며, resolve되기 전까지 상위 Suspense의 fallback 스켈레톤을 렌더링하고 완료 시 실제 UI로 자동 전환합니다."
        steps={[
          {
            step: 1,
            title: '메인 상품 정보 즉시 렌더 확인',
            description: '상단의 키보드 상품명과 가격(189,000원)이 지연 없이 즉각 표시되는 빠른 초기 셸 렌더링을 확인합니다.',
            actionBadge: '초기 셸 렌더',
          },
          {
            step: 2,
            title: '[⚡ 1. 구매 고객 후기 스트리밍 시작] 클릭',
            description: '지연 시간을 선택하고 스트리밍 시작 버튼을 클릭하여 Promise를 생성합니다.',
            actionBadge: '스트리밍 실행',
          },
          {
            step: 3,
            title: 'Suspense 스켈레톤 ➔ use(Promise) 전환 관찰',
            description: '설정된 지연 시간 동안 노란색 스켈레톤이 표시된 후, use(reviewsPromise)가 구매 후기 3건으로 매끄럽게 교체되는 것을 관찰합니다.',
            actionBadge: 'use() 언랩 관찰',
            observe: '지연 시간 경과 후 Suspense 스켈레톤이 실제 구매 후기 3건(개발자K, 키보드매니아, 디자이너P)으로 자동 전환됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단, 3단, 4단: 실습 조작 영역 및 검증/개념정리 (스트리밍 Suspense 연동) */}
      <DemoPlaygroundCard title="상품 상세 뷰 (즉시 렌더 본문 + 스트리밍 후기)" className="space-y-8">
        {/* 즉각 렌더링된 메인 상품 카드 */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/90 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2 mb-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
              {product.name}
            </h3>
            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700">
              {product.price.toLocaleString()}원
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{product.desc}</p>
        </div>

        {/* 스트리밍 조작 및 Suspense 바운더리 Client Component */}
        <ReviewsStreamingClient />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
