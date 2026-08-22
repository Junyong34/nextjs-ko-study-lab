import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RecommendedProducts } from './components/RecommendedProducts'
import { LiveReviewStream } from './components/LiveReviewStream'
import { VerificationFooter } from './components/VerificationFooter'

export default function StreamingNestedDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="중첩 Suspense 점진적 청크 스트리밍"
        concept="Next.js는 무거운 서브 컴포넌트를 독립적인 <Suspense> 바운더리로 감싸면, 메인 상품 정보를 0ms만에 즉시 화면에 띄우고 느린 추천 목록(600ms)과 리뷰 목록(1000ms)을 순차적으로 스트리밍 렌더링합니다."
        steps={[
          {
            step: 1,
            title: '메인 상품 0ms 즉시 렌더',
            description: '상단의 상품 기본 정보(가격, 모델명)가 지연 없이 즉시 표시됩니다.',
            actionBadge: 'Fast FCP',
          },
          {
            step: 2,
            title: '추천 상품(600ms) 도착',
            description: '첫 번째 Suspense 스켈레톤이 해제되며 추천 상품 카드가 화면에 스트리밍 주입됩니다.',
            actionBadge: '청크 #1 스트리밍',
          },
          {
            step: 3,
            title: '리뷰 목록(1000ms) 최종 도착',
            description: '두 번째 Suspense 스켈레톤이 해제되며 실시간 리뷰 목록이 스트리밍 완료됩니다.',
            actionBadge: '청크 #2 스트리밍',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="이커머스 상품 상세 (중첩 스트리밍 파이프라인)" className="space-y-4">
        {/* 즉시 렌더되는 메인 상품 헤더 */}
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              커스텀 CNC 풀알루미늄 기계식 키보드 (RGB 핫스왑)
            </h3>
            <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              219,000원
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            가스켓 마운트 구조, Poron 흡음재, 공장 윤활 리니어 스위치 탑재
          </p>
        </div>

        {/* 1차 스트리밍: 추천 상품 (600ms) */}
        <Suspense
          fallback={
            <div className="rounded-md border border-dashed border-zinc-300 p-6 text-center text-xs font-mono text-zinc-400 animate-pulse dark:border-zinc-700">
              [대기] 함께 구매하면 좋은 상품 로딩 중 (600ms 지연)...
            </div>
          }
        >
          <RecommendedProducts />
        </Suspense>

        {/* 2차 스트리밍: 실시간 후기 (1000ms) */}
        <Suspense
          fallback={
            <div className="rounded-md border border-dashed border-zinc-300 p-6 text-center text-xs font-mono text-zinc-400 animate-pulse dark:border-zinc-700">
              [대기] 구매 고객 후기 스트리밍 수신 중 (1000ms 지연)...
            </div>
          }
        >
          <LiveReviewStream />
        </Suspense>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
