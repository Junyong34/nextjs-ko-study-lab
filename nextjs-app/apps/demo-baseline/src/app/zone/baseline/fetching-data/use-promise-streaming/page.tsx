import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ReviewsStreamingClient } from './components/ReviewsStreamingClient'
import { ReviewsSkeleton } from './components/ReviewsSkeleton'
import { VerificationFooter } from './components/VerificationFooter'
import type { ProductReview } from './types'

// 1. 메인 상품 정보: 서버에서 즉시 로드 (빠른 FCP)
async function getProductInfo() {
  return {
    id: 'stream-keyboard-01',
    name: '커스텀 87키 알루미늄 가스켓 기계식 키보드',
    price: 189000,
    desc: 'CNC 풀 알루미늄 하우징, 가스켓 마운트 구조, 핫스왑 지원 하이엔드 키보드',
  }
}

// 2. 구매 후기 데이터: 의도적 지연 Promise (await하지 않고 전달)
async function getReviewsPromise(): Promise<ProductReview[]> {
  // 실제 프로덕션의 무거운 서드파티 리뷰 DB 조회 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      id: 'rev-1',
      author: '개발자K',
      rating: 5,
      comment: '타건음이 조약돌 굴러가는 소리처럼 정말 도각도각 좋습니다! 대만족.',
      createdAt: '2026-08-20',
    },
    {
      id: 'rev-2',
      author: '키보드매니아',
      rating: 5,
      comment: '풀 알루미늄이라 묵직해서 흔들림 없이 안정적으로 코딩할 수 있네요.',
      createdAt: '2026-08-19',
    },
    {
      id: 'rev-3',
      author: '디자이너P',
      rating: 4,
      comment: '마감 퀄리티가 훌륭합니다. 블루투스 멀티페어링도 빠르고 매끄러워요.',
      createdAt: '2026-08-18',
    },
  ]
}

export default async function UsePromiseStreamingDemoPage() {
  const product = await getProductInfo()
  // await하지 않고 Promise 객체를 생성하여 전달
  const reviewsPromise = getReviewsPromise()

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="React 19 use(Promise) & Suspense 점진적 스트리밍"
        concept="Server Component에서 800ms 지연되는 후기 데이터를 await하지 않고 Promise 객체 그대로 Client Component에 넘기면, Suspense 스켈레톤을 띄워둔 채 백그라운드 스트리밍으로 언랩(unwrap)합니다."
        steps={[
          {
            step: 1,
            title: '메인 상품 정보 0ms 즉시 렌더 확인',
            description: '상단의 키보드 상품명과 가격(189,000원)이 지연 없이 즉각 표시되는 빠른 FCP를 확인합니다.',
            actionBadge: '즉시 렌더',
          },
          {
            step: 2,
            title: 'Suspense 로딩 스켈레톤 표시 확인',
            description: '후기 영역이 준비될 때까지 800ms 동안 ReviewsSkeleton이 렌더링되는 것을 확인합니다.',
            actionBadge: '스트리밍 대기',
          },
          {
            step: 3,
            title: 'React 19 use() 언랩 결과 관찰',
            description: '800ms 후 Promise가 resolve되면서 use(reviewsPromise)가 구매 후기 3건을 화면에 매끄럽게 렌더링하는 것을 관찰합니다.',
            actionBadge: 'use(Promise) 언랩',
            observe: '800ms 경과 후 스켈레톤이 실제 구매 후기 3건(개발자K, 키보드매니아, 디자이너P)으로 자동 전환됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="상품 상세 뷰 (즉시 렌더 본문 + 스트리밍 후기)" className="space-y-4">
        {/* 즉각 렌더링된 메인 상품 카드 */}
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {product.name}
            </h3>
            <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {product.price.toLocaleString()}원
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{product.desc}</p>
        </div>

        {/* 스트리밍 Suspense 바운더리 + React 19 use() Client Component */}
        <Suspense fallback={<ReviewsSkeleton />}>
          <ReviewsStreamingClient reviewsPromise={reviewsPromise} />
        </Suspense>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
