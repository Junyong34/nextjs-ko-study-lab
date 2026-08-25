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
        title={"중첩 Suspense 스트리밍 및 점진적 청크 렌더링"}
        concept={"상품 기본 정보(빠른 응답)와 리뷰·재고(느린 응답, 1200ms)를 중첩 <Suspense> 경계로 분리하여 서버에서 HTML 청크를 스트리밍 전송하고 초기 바이트 수신 시간(TTFB)을 단축합니다."}
        steps={[
          {
            step: 1,
            title: "상위 헤더 및 기본 상품 카드 수신 확인",
            description: "지연 없는 상위 레이아웃과 상품 기본 정보가 0ms 즉각 렌더링되는 것을 확인합니다.",
            actionBadge: "초기 청크 수신",
          },
          {
            step: 2,
            title: "중첩 [로딩 스켈레톤] 스트리밍 대기",
            description: "리뷰 및 추천 영역이 독립된 Suspense fallback 스켈레톤 상태로 유지되는지 확인합니다.",
            actionBadge: "스트리밍 중",
          },
          {
            step: 3,
            title: "1200ms 후 비동기 청크 수신 및 점진적 마운트 관찰",
            description: "서버 백그라운드 데이터 패칭이 완료되어 지연 컴포넌트가 점진적으로 교체되는 과정을 검증합니다.",
            actionBadge: "청크 렌더링 완료",
            observe: "1200ms 지연 후 리뷰 및 추천 목록 청크가 스켈레톤에서 실제 콘텐츠로 교체 마운트되는 동작 관찰",
            observeAt: "playground",
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
