import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/intercepting-routes')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ModalInterceptionClient } from './components/ModalInterceptionClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function InterceptingRoutesDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title={"가로채기 라우트 ((..)photo) 모달 오버레이 및 복원"}
        concept={"피드에서 상품 클릭 시 (..)photo/[id]/page.tsx가 소프트 네비게이션을 가로채 배경 피드를 유지한 채 모달을 띄우고, 새로고침 시 전체 독립 페이지(200 OK)로 복원합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "[모달 열기 →] 클릭",
                    "description": "갤러리 피드에서 상품 사진을 클릭하여 인터셉트 라우트 (..)feed를 실행합니다.",
                    "actionBadge": "모달 열기"
          },
          {
                    "step": 2,
                    "title": "인터셉팅 모달 및 URL 슬러그 변경 확인",
                    "description": "배경 피드가 그대로 유지된 채 모달 오버레이가 뜨고 URL이 변경되는지 확인합니다.",
                    "actionBadge": "인터셉트 확인"
          },
          {
                    "step": 3,
                    "title": "[✕ 닫기], [확인 및 모달 닫기 (router.back)] 클릭",
                    "description": "모달 닫기 버튼을 클릭하여 이전 피드 상태로 즉시 복귀합니다.",
                    "actionBadge": "모달 닫기"
          },
          {
                    "step": 4,
                    "title": "[← 갤러리 피드로 이동] 및 직접 URL 진입 대조 관찰",
                    "description": "새로고침 또는 직접 URL 입력 시에는 모달이 아닌 단독 페이지로 렌더링되는지 관찰합니다.",
                    "actionBadge": "경로 대조 관찰",
                    "observe": "인터셉팅 네비게이션 시 모달 오버레이로 뜨고 새로고침 시 단독 상세 페이지로 렌더링됨",
                    "observeAt": "playground"
          }
]}
        />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="이커머스 상품 갤러리 & 인터셉트 상세 모달" className="space-y-4">
        <ModalInterceptionClient />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
