import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { RecommendedProducts } from './components/RecommendedProducts'
import { LiveReviewStream } from './components/LiveReviewStream'
import { StreamingNestedClientWrapper } from './components/StreamingNestedClientWrapper'

export default function StreamingNestedDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="중첩 Suspense 스트리밍 및 점진적 청크 렌더링"
        concept="상품 기본 정보(빠른 응답)와 추천 상품(600ms), 구매 후기(1000ms)를 계층적 중첩 <Suspense> 경계로 분리하여 서버에서 HTML 청크를 순차 스트리밍 전송하고 초기 체감 속도를 극대화합니다."
        steps={[
          {
            step: 1,
            title: '상위 헤더 및 기본 상품 카드 수신 확인',
            description: '지연 없는 상위 레이아웃과 상품 기본 정보가 초기 요청 시 즉시 렌더링되는 것을 확인합니다.',
            actionBadge: '초기 청크 수신',
          },
          {
            step: 2,
            title: '중첩 [로딩 스켈레톤] 스트리밍 대기',
            description: '추천 상품(600ms)과 중첩된 후기(1000ms) 영역이 독립된 Suspense fallback 스켈레톤 상태로 유지되는지 확인합니다.',
            actionBadge: '스트리밍 중',
          },
          {
            step: 3,
            title: '600ms / 1000ms 2단계 점진적 청크 수신 관찰',
            description: '추천 상품 청크(600ms) 수신 후 중첩된 후기 청크(1000ms, 별점 ★★★★★)가 점진적으로 교체 마운트되는 과정을 검증합니다.',
            actionBadge: '청크 렌더링 완료',
            observe: '600ms(추천 상품) 및 1000ms(실시간 후기) 지연 후 중첩 Suspense 청크가 스켈레톤에서 실제 콘텐츠(★ 별점 포함)로 순차 교체 렌더링됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단, 3단, 4단: 중첩 Suspense 계층 구조 및 클라이언트 상태 래퍼 */}
      <StreamingNestedClientWrapper>
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

        {/* 계층적 중첩 Suspense 구조: 외측(추천 600ms) -> 내측(후기 1000ms) */}
        <Suspense
          fallback={
            <div className="rounded-md border border-dashed border-zinc-300 p-6 text-center text-xs font-mono text-zinc-400 animate-pulse dark:border-zinc-700">
              [1차 대기] 함께 구매하면 좋은 추천 상품 스트리밍 로딩 중 (600ms)...
            </div>
          }
        >
          <RecommendedProducts>
            <Suspense
              fallback={
                <div className="rounded-md border border-dashed border-zinc-300 p-6 text-center text-xs font-mono text-zinc-400 animate-pulse dark:border-zinc-700">
                  [2차 대기] 구매 고객 실시간 후기 스트리밍 수신 중 (1000ms)...
                </div>
              }
            >
              <LiveReviewStream />
            </Suspense>
          </RecommendedProducts>
        </Suspense>
      </StreamingNestedClientWrapper>
    </DemoContainer>
  )
}
