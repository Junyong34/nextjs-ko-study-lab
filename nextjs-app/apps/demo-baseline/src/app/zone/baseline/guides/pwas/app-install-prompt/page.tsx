import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/pwas/app-install-prompt')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PwaInstallPromptDemo } from './components/PwaInstallPromptDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"PWA Web App Manifest 및 맞춤형 앱 설치 프롬프트"}
        concept={"manifest.json 설정과 BeforeInstallPromptEvent 이벤트를 가로채어, 사용자가 구매 완료 시점에 자연스럽게 홈 화면 앱 설치를 유도하는 맞춤형 PWA 인스톨 경험을 제공합니다."}
        steps={[
          {
            step: 1,
            title: "[앱 홈화면에 설치] 클릭",
            description: "앱 아이콘, 테마 컬러, 시작 URL이 정의된 웹 앱 매니페스트 등록 상태를 점검합니다.",
            actionBadge: "매니페스트 점검",
          },
          {
            step: 2,
            title: "[[확인] 홈 화면에 추가되었습니다 쇼핑몰 앱 홈 화면에 설치하기] 클릭",
            description: "브라우저 기본 배너 대신 커스텀 UI에서 네이티브 설치 프롬프트를 실행합니다.",
            actionBadge: "설치 프롬프트 실행",
          },
          {
            step: 3,
            title: "홈 화면 추가 완료 상태 전환 및 오프라인 지원 관찰",
            description: "PWA 설치 완료 피드백과 함께 독립형(Standalone) 앱 실행 모드로의 전환을 검증합니다.",
            actionBadge: "설치 완료 검증",
            observe: "맞춤형 설치 버튼 클릭 후 홈 화면 추가 완료 상태 전환 및 PWA 매니페스트 연동 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"홈 화면 추가 PWA 프롬프트 및 manifest 실습"}>
        <PwaInstallPromptDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
