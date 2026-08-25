import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DefaultHardReloadDemo } from './components/DefaultHardReloadDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"default.tsx 브라우저 새로고침(F5) 슬롯 복원"}
        concept={"소프트 네비게이션으로 병렬 슬롯을 전환한 후 브라우저 새로고침(하드 리로드)을 실행하면, Next.js는 매칭 세그먼트가 없는 슬롯에 default.tsx를 렌더링하여 화면을 복원합니다."}
        steps={[
        {
        "step": 1,
        "title": "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
        "description": "병렬 슬롯 테스트를 위한 기본 상품 항목을 선택합니다.",
        "actionBadge": "상품 선택"
        },
        {
        "step": 2,
        "title": "[+] 수량 조절 후 [동작 실행] 클릭",
        "description": "슬롯 상태를 동기화하고 새로고침 복원 시나리오를 준비합니다.",
        "actionBadge": "상태 동기화"
        },
        {
        "step": 3,
        "title": "하드 새로고침 시 슬롯 복원 상태 확인",
        "description": "새로고침 시 활성 상태를 잃어버린 슬롯이 default.tsx를 통해 안전하게 초기 UI로 복원되는지 확인합니다.",
        "actionBadge": "슬롯 복원",
        "observe": "3단 검증 패널에서 default.tsx 기반의 새로고침 슬롯 복구 동작과 검증 데이터 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"새로고침(Hard Reload) 시 슬롯 복구 실습"}>
        <DefaultHardReloadDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
