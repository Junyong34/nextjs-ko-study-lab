import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ObservationProvider } from './components/ObservationContext'
import { CategoryNav } from './components/CategoryNav'
import { VerificationFooter } from './components/VerificationFooter'

/**
 * [category] 바깥의 정적 layout. category가 바뀌어도 유지되므로
 * 이동 전후 관측값을 비교하는 기록 장치(ObservationProvider)를 여기에 둔다.
 */
export default function DynamicCategoryDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ObservationProvider>
      <DemoContainer className="space-y-6">
        <DemoGuideCard
          title="[category]/layout.tsx 동적 카테고리 레이아웃"
          concept="[category]/layout.tsx는 params로 자기 세그먼트까지의 값({ category })만 받고 searchParams는 받지 않는다. 같은 category 안에서 page만 바뀌면 layout은 다시 렌더되지 않고, category 값이 바뀌면 새로 렌더·마운트된다."
          steps={[
            {
              step: 1,
              title: '[전자기기 > prod-001] 이동 후 [목록 (?sort=price)] 이동',
              description: 'layout의 await params에 item 키가 없고, props 키에 searchParams가 없는지 page가 받은 값과 비교합니다.',
              actionBadge: 'params 범위',
            },
            {
              step: 2,
              title: '[카테고리 메모] 입력·[관심 표시 +1] 후 같은 카테고리의 다른 링크로 이동',
              description: '전자기기 안에서 목록·상품을 오가며 render ID·mount ID·메모·카운터가 유지되는지 봅니다.',
              actionBadge: '같은 category',
            },
            {
              step: 3,
              title: '메모·카운터를 둔 채 [패션] 링크로 이동',
              description: 'category 값이 바뀌면 render ID·mount ID가 새로 생기고 메모·카운터가 초기화되는지 봅니다.',
              actionBadge: 'category 변경',
              observe: '네 항목이 모두 일치로 바뀌는지 확인',
              observeAt: 'verification',
            },
          ]}
        />
        <DemoPlaygroundCard title="카테고리 쇼핑 화면 (실제 [category]/[item] 라우트)" className="min-w-0">
          <CategoryNav />
          <div className="mt-4 min-w-0">{children}</div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </DemoContainer>
    </ObservationProvider>
  )
}
