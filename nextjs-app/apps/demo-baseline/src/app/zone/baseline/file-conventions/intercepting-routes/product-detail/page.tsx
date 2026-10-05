import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/intercepting-routes/product-detail',
)

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { PRODUCT_SUMMARIES } from './data'
import { DETAIL_DELAY_MS } from './constants'
import { NoSeedLink, ProductCard } from './components/ProductCard'
import { ProductDeepDive } from './components/DeepDive'

export default function ProductDetailInterceptDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 가이드 */}
      <DemoGuideCard
        title="상품 상세 가로채기 — 앱 안에서는 모달, 직접 진입에는 정식 페이지"
        concept="같은 상품 주소(products/[id])라도 앱 안에서 이동(소프트 내비게이션)하면 @modal/(.)products/[id]가 가로채 목록 요약을 즉시 보여 주고, 주소로 직접 진입·새로고침(하드 내비게이션)하면 products/[id]/page.tsx가 메타데이터와 함께 스트리밍으로 렌더링됩니다."
        steps={[
          {
            step: 1,
            title: '[앱 안에서 이동 (소프트 내비게이션)] 클릭',
            description: `카드의 요약(이름·가격)이 모달에 즉시 뜨고, 설명·사양은 스켈레톤 뒤 약 ${DETAIL_DELAY_MS / 1000}초 후 채워집니다.`,
            actionBadge: '요약 즉시',
            observe: '요약 표시 → 상세 도착 간격이 검증 패널에 ms로 표시됨',
            observeAt: 'verification',
          },
          {
            step: 2,
            title: '[요약 없는 상품 #204 열기] 클릭',
            description: '목록에 요약이 없으면 모달도 전체 스켈레톤으로 시작해, 상세가 오면 한꺼번에 채웁니다.',
            actionBadge: '요약 없음',
            observe: '간격 ≈ 0ms(요약과 상세가 같은 시점에 표시)',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '모달이 열린 상태에서 브라우저 새로고침(F5)',
            description: '같은 주소가 이번에는 정식 페이지로 렌더됩니다. 스켈레톤이 먼저 보이고 본문이 뒤따릅니다.',
            actionBadge: '하드 내비게이션',
            observe: '탭 제목에 상품명이 들어가고, 응답 수신에 약 2초가 걸림',
            observeAt: 'verification',
          },
          {
            step: 4,
            title: '[새 탭에서 직접 진입 (하드 내비게이션)] 클릭',
            description: '새 탭은 가로채기 없이 곧바로 정식 페이지로 열립니다.',
            actionBadge: '정식 페이지',
          },
        ]}
      />

      {/* 2단. 실습 화면 */}
      <DemoPlaygroundCard title="아웃도어 장비 목록 (상품 상세 가로채기)">
        <div className="mb-3 flex justify-end">
          <DemoResetButton label="목록 새로고침" />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PRODUCT_SUMMARIES.map((summary) => (
              <ProductCard key={summary.id} summary={summary} />
            ))}
          </div>
          <NoSeedLink />
        </div>
      </DemoPlaygroundCard>

      {/* 3단. 검증 — 실측 패널은 목적지 화면(모달 / 정식 페이지)에 표시된다 */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 text-xs leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
        [검증] 실측 패널은 목적지 화면(모달 오버레이 / 정식 페이지)에 각각 표시됩니다. 위 링크를 눌러 두 화면의
        &quot;진입 방식 실측&quot; 패널을 직접 대조하세요. 같은 주소를 소프트·하드 내비게이션으로 열었을 때
        탭 제목과 응답 수신 시간이 어떻게 다른지 비교하는 것이 핵심입니다.
      </div>

      {/* 4단. 개념 정리 */}
      <ProductDeepDive />
    </DemoContainer>
  )
}
