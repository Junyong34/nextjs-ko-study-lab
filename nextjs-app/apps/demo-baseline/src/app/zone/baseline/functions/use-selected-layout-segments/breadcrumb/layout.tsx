'use client'

import React from 'react'
import { useSelectedLayoutSegments } from 'next/navigation'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { BreadcrumbTrail } from './components/BreadcrumbTrail'
import { VerificationFooter } from './components/VerificationFooter'

export default function BreadcrumbLayout({ children }: { children: React.ReactNode }) {
  // useSelectedLayoutSegments()는 이 훅이 호출된 layout.tsx 하위에서 활성화된 세그먼트
  // "전체"를 배열로 반환한다. 한 단계 아래만 보는 단수형 useSelectedLayoutSegment()와 달리
  // category/[category]/[id]처럼 몇 단계든 내려간 전체 경로를 한 번에 얻는다. 그래서 반드시
  // 이 최상위 layout.tsx에서 호출해야 한다 — 더 하위(category/[category]/layout.tsx 등)에서
  // 호출하면 그 지점 기준으로 더 짧은 배열만 돌려받는다.
  const segments = useSelectedLayoutSegments()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="useSelectedLayoutSegments() 계층형 브레드크럼 생성"
        concept="useSelectedLayoutSegments()는 이 훅이 호출된 layout.tsx 하위의 활성 라우트 세그먼트 전체를 배열로 반환합니다. 카테고리 목록(category/[category])과 상품 상세(category/[category]/[id])처럼 실제 중첩 깊이가 달라지면, 배열 길이도 0 → 2 → 3으로 실제로 늘어나는 것을 관찰할 수 있습니다."
        steps={[
          {
            step: 1,
            title: '카테고리 카드 클릭',
            description: '실제 <Link href=".../category/[slug]">를 클릭해 물리적으로 존재하는 카테고리 목록 서브 라우트로 이동합니다.',
            actionBadge: '깊이 1단계',
          },
          {
            step: 2,
            title: '상품 카드 클릭',
            description: '상품 상세 서브 라우트(.../category/[slug]/[id])로 한 단계 더 이동합니다.',
            actionBadge: '깊이 2단계',
            observe: '세그먼트 배열 길이가 2에서 3으로 늘어나고 배열 끝에 상품 id가 추가됨',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '상단 브레드크럼으로 역이동',
            description: '브레드크럼의 상위 항목을 클릭해 실제로 뒤로 이동하며 배열이 다시 줄어드는지 확인합니다.',
            actionBadge: '깊이 축소',
            observe: '방문한 서로 다른 배열 길이(0, 2, 3)가 모두 검증 패널에 기록됨',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="useSelectedLayoutSegments() 계층형 브레드크럼 — /category/[category]/[id]">
        <div className="space-y-3">
          <BreadcrumbTrail segments={segments} />

          <div className="rounded border border-zinc-200 bg-zinc-950 px-3.5 py-2 font-mono text-[11px] text-zinc-300 dark:border-zinc-800">
            useSelectedLayoutSegments() 반환값:{' '}
            <span className="text-blue-300">{JSON.stringify(segments)}</span>
            <span className="ml-2 text-zinc-500">(길이 {segments.length})</span>
          </div>

          <div className="pt-1">{children}</div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter segments={segments} />
    </DemoContainer>
  )
}
