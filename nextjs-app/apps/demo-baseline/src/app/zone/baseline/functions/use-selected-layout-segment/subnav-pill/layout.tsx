'use client'

import React from 'react'
import { useSelectedLayoutSegment } from 'next/navigation'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SubnavPill } from './components/SubnavPill'
import { VerificationFooter } from './components/VerificationFooter'
import { DEMO_PRODUCT } from './types'

export default function SubnavPillLayout({ children }: { children: React.ReactNode }) {
  // useSelectedLayoutSegment()는 자신이 호출된 layout.tsx 바로 한 단계 아래의 활성
  // 세그먼트만 읽는다. 그래서 반드시 이 파일(상품 상세 layout)에서 호출해야 /specs,
  // /reviews, /shipping 서브 라우트의 이름을 정확히 얻는다 — page.tsx에서 호출하면
  // 그 페이지 자신을 기준으로 "한 단계 더 아래"를 찾으려 하므로 값이 어긋난다.
  const segment = useSelectedLayoutSegment()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="useSelectedLayoutSegment() 하위 탭 인디케이터"
        concept="useSelectedLayoutSegment()는 이 훅이 호출된 layout.tsx 바로 한 단계 아래의 활성 라우트 세그먼트 이름을 문자열(또는 null)로 반환합니다. 상품 상세 페이지의 [개요]/[상세 스펙]/[리뷰]/[배송 안내] 탭은 실제 서브 라우트이며, 탭을 클릭해 이동할 때마다 이 훅의 반환값이 실시간으로 바뀌어 Pill 인디케이터 위치를 결정합니다."
        steps={[
          {
            step: 1,
            title: '[상세 스펙] 탭 클릭',
            description: '실제 <Link href=".../specs">를 클릭해 물리적으로 존재하는 서브 라우트로 이동합니다.',
            actionBadge: '실제 이동',
          },
          {
            step: 2,
            title: '[리뷰], [배송 안내] 탭으로 계속 이동',
            description: '여러 서브 라우트를 오가며 useSelectedLayoutSegment()가 반환하는 문자열이 클릭할 때마다 바뀌는지 확인합니다.',
            actionBadge: '세그먼트 전환',
            observe: '인스펙터에 표시된 반환값이 방금 클릭한 탭의 segment와 정확히 일치',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[개요] 탭(기본 경로)으로 복귀',
            description: '레이아웃 자신의 기본 경로로 돌아왔을 때 훅이 문자열이 아니라 null을 반환하는지 확인합니다.',
            actionBadge: 'null 반환 확인',
            observe: '반환값이 "overview" 같은 문자열이 아니라 null로 표시됨',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="useSelectedLayoutSegment() 하위 탭 인디케이터 — 실제 서브 라우트(/specs, /reviews, /shipping) 이동">
        <div className="space-y-3">
          <div className="rounded border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{DEMO_PRODUCT.name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {DEMO_PRODUCT.categoryName} · {DEMO_PRODUCT.price.toLocaleString()}원
            </p>
          </div>

          <SubnavPill segment={segment} />

          <div className="rounded border border-zinc-200 bg-zinc-950 px-3.5 py-2 font-mono text-[11px] text-zinc-300 dark:border-zinc-800">
            useSelectedLayoutSegment() 반환값:{' '}
            <span className="text-blue-300">{segment === null ? 'null' : `"${segment}"`}</span>
          </div>

          <div className="pt-1">{children}</div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter segment={segment} />
    </DemoContainer>
  )
}
