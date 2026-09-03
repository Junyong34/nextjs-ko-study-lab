import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/link/prefetch-options')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { LinkPrefetchOptionsDemo } from './components/LinkPrefetchOptionsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"next/link prefetch (auto vs full vs false) 옵션 대조"}
        concept={"<Link prefetch>의 3가지 모드(auto: 정적 세그먼트만, full: 전체 트리, false: 뷰포트 진입 시 페치 안함)를 통해 모바일 네트워크 대역폭과 0ms 전환 속도를 조율합니다."}
        steps={[
        {
        "step": 1,
        "title": "prefetch={null} (auto 기본값) 확인",
        "description": "정적 세그먼트 데이터만 prefetch하고 동적 데이터는 클릭 시 가져오는 기본 동작을 점검합니다.",
        "actionBadge": "auto prefetch"
        },
        {
        "step": 2,
        "title": "prefetch={true} (full prefetch) 확인",
        "description": "정적/동적 데이터를 포함한 전체 라우트 트리를 즉시 캐싱하여 0ms 전환을 준비합니다.",
        "actionBadge": "full prefetch"
        },
        {
        "step": 3,
        "title": "prefetch={false} 대역폭 절약 모드 확인",
        "description": "뷰포트에 진입해도 백그라운드 prefetch를 실행하지 않아 네트워크 비용을 절감하는지 대조합니다.",
        "actionBadge": "false 모드",
        "observe": "3단 검증 패널에서 prefetch 옵션별 캐시 로딩 전략과 네트워크 요청 동작 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"<Link prefetch> 옵션 대조 (auto vs full vs false) 실습"}>
        <LinkPrefetchOptionsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
