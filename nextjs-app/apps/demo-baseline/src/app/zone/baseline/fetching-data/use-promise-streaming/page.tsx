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
        title="React 19 use(Promise) & 다중 Suspense 점진적 병렬 스트리밍"
        concept="빠른 데이터(메인 상품)는 서버에서 즉시 렌더링하고, 느린 데이터들(1.2초 후기, 2.5초 추천)은 await하지 않고 독립된 Promise 객체로 자식 컴포넌트에 넘깁니다. 자식 컴포넌트는 use(promise)로 데이터를 언랩하며, 각 데이터가 준비되는 순서대로 Suspense 스켈레톤에서 실제 UI로 점진적 전환됩니다."
        steps={[
          {
            step: 1,
            title: '메인 상품 정보 즉시 렌더 확인 (0초 FCP)',
            description: '상단의 키보드 상품명과 가격(189,000원)이 느린 후기/추천 데이터를 기다리지 않고 즉시 표시되는 빠른 초기 렌더링을 확인합니다.',
            actionBadge: '0초 즉시 렌더',
          },
          {
            step: 2,
            title: '[⚡ 1. 점진적 병렬 스트리밍 시작] 클릭',
            description: '1.2초 후기 Promise와 2.5초 추천 Promise를 동시에 생성하여 각각의 Suspense 스켈레톤이 독립적으로 렌더링되는 것을 확인합니다.',
            actionBadge: '병렬 스트리밍',
          },
          {
            step: 3,
            title: '순차적 언랩 관찰 (1.2초 후기 ➔ 2.5초 추천)',
            description: '1.2초 시점에 [스트리밍 1 후기]가 먼저 실제 UI로 전환되고, 이어서 2.5초 시점에 [스트리밍 2 추천 상품]이 전환되는 점진적 화면 완성을 관찰합니다.',
            actionBadge: '순차 언랩 관찰',
            observe: '1.2초에 구매 후기 3건 마운트 ➔ 2.5초에 AI 추천 상품 3건 마운트 (전체 블로킹 없이 순차 렌더링)',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단, 3단, 4단: 실습 조작 영역 및 검증/개념정리 (스트리밍 Suspense 연동) */}
      <DemoPlaygroundCard title="상품 상세 뷰 (즉시 렌더 본문 + 점진적 다중 스트리밍)" className="space-y-8">
        {/* 1. 즉각 렌더링된 메인 상품 카드 (비스트리밍 / 빠른 FCP 영역) */}
        <div className="rounded-2xl border-2 border-zinc-300 bg-zinc-50/90 p-5 sm:p-6 dark:border-zinc-700 dark:bg-zinc-900/50 space-y-2 mb-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
                {product.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                ⚡ 0초 즉시 렌더링 영역 (비스트리밍 / 빠른 FCP)
              </span>
              <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700">
                {product.price.toLocaleString()}원
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">{product.desc}</p>
        </div>

        {/* 2. 스트리밍 조작 및 2개의 [🌊 Suspense 스트리밍 영역] Client Component */}
        <ReviewsStreamingClient />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
