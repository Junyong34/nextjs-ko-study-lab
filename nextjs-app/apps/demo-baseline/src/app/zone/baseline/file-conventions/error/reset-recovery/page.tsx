import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ResetRecoveryDemo } from './components/ResetRecoveryDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"error.tsx reset() 컴포넌트 재시도 복구"}
        concept={"error.tsx의 reset() 함수는 React 에러 바운더리의 내부 상태를 클리어하고 해당 라우트 세그먼트의 재렌더링을 시도하여 무중단 복구 메커니즘을 제공합니다."}
        steps={[
        {
        "step": 1,
        "title": "에러 트리거 발생 확인",
        "description": "서버/클라이언트 렌더링 중 발생한 예외 상태를 점검합니다.",
        "actionBadge": "에러 감지"
        },
        {
        "step": 2,
        "title": "[다시 시도 (reset() 호출)] 클릭",
        "description": "reset() 함수를 호출하여 에러 바운더리 내부 상태를 리셋하고 컴포넌트를 다시 마운트합니다.",
        "actionBadge": "reset() 호출"
        },
        {
        "step": 3,
        "title": "정상 렌더링 상태 복구 확인",
        "description": "재시도 후 정상 컴포넌트가 다시 렌더링되어 에러 화면이 해소되는지 확인합니다.",
        "actionBadge": "복구 완료",
        "observe": "3단 검증 패널에서 reset() 실행 후 실제 렌더링 상태가 정상 복구로 전환되는지 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"error.tsx reset() 컴포넌트 재시도 복구 실습"}>
        <ResetRecoveryDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
