import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { NavigationClientDemo } from './components/NavigationClientDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="useRouter push vs replace vs back 프로그래밍 네비게이션"
        concept="useRouter() 훅의 router.push(), router.replace(), router.back() 메서드를 호출하여 히스토리 스택 조작 및 브라우저 URL 이동을 0ms 클라이언트 사이드로 제어합니다."
        steps={[
          {
            step: 1,
            title: "[1. router.push(상세)] 클릭",
            description: "새로운 라우트 엔트리를 브라우저 히스토리 스택에 push 방식으로 추가하며 이동합니다.",
            actionBadge: "push 이동",
          },
          {
            step: 2,
            title: "[2. router.replace(결제완료)] 클릭",
            description: "결제 완료 후 뒤로가기를 방지하기 위해 현재 히스토리 스택 엔트리를 replace로 즉시 교체합니다.",
            actionBadge: "replace 교체",
          },
          {
            step: 3,
            title: "[3. router.back()] 실행 및 히스토리 스택 관찰",
            description: "router.back() 호출 시 직전 페이지로 복귀하며 브라우저 히스토리 스택 변화를 확인합니다.",
            actionBadge: "스택 검증",
            observe: "이동 방식(push/replace/back)에 따라 활성 라우트 및 히스토리 스냅샷이 실시간 로그에 반영됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"useRouter push vs replace vs back 프로그래밍 네비게이션 실습"}>
        <NavigationClientDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
