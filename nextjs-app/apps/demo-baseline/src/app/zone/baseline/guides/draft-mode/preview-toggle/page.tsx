import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/draft-mode/preview-toggle')

import React from 'react'
import { draftMode } from 'next/headers'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DraftModeDemo } from './components/DraftModeDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default async function DemoPage() {
  const { isEnabled: isDraft } = await draftMode()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Draft Mode 토글 및 미발행 특가 상품 미리보기"}
        concept={"draftMode().enable() API를 통해 Bypass 쿠키(__prerender_bypass)를 발급받아 0ms 정적 캐시를 우회하고 Headless CMS의 미발행 초안(Draft) 상품 데이터를 실시간 렌더링합니다."}
        steps={[
          {
            step: 1,
            title: "기본 발행 상품(공개 상태) 목록 확인",
            description: "Draft Mode가 꺼져 있을 때 일반 사용자에게 노출되는 정적 캐시 상품들을 확인합니다.",
            actionBadge: "공개 상태 점검",
          },
          {
            step: 2,
            title: "[Draft Mode 켜기] 버튼 클릭",
            description: "드래프트 모드를 활성화하여 Bypass 쿠키를 설정하고 초안 데이터를 요청합니다.",
            actionBadge: "초안 모드 활성화",
          },
          {
            step: 3,
            title: "[Draft Mode 끄기] 클릭으로 일반 공개 모드 복귀 및 초안 렌더링 관찰",
            description: "정적 캐시 우회로 초안 상품이 노출된 후 다시 끄기 버튼으로 정적 상태로 복귀하는지 검증합니다.",
            actionBadge: "상태 복원 검증",
            observe: "Draft Mode 활성화 시 미공개 특가 상품 렌더링 및 비활성화 시 정적 발행 목록 복귀 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"미공개 특가 상품 Draft Mode 토글 및 Bypass 쿠키 실습"}>
        <DraftModeDemo isDraft={isDraft} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={true}
        actual={`- draftMode().isEnabled: ${isDraft}\n- ${isDraft ? '__prerender_bypass 쿠키가 설정되어 초안 데이터 렌더링 중' : '쿠키 없음, 정적 공개 데이터 렌더링 중'}`}
      />
    </DemoContainer>
  )
}
