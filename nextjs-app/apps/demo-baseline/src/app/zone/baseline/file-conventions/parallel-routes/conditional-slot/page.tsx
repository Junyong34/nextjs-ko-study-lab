import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ParallelConditionalDemo } from './components/ParallelConditionalDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"권한별 조건부 슬롯 분기 (@admin / @user)"}
        concept={"ConditionalSlotLayout이 admin·user 두 슬롯을 props로 받아 grid에 나란히 배치합니다. 권한별 화면을 useState 분기가 아니라 @admin/page.tsx·@user/page.tsx 파일 경계로 분리한 구조입니다."}
        steps={[
          {
            step: 1,
            title: "[@admin] 관리자 슬롯 확인",
            description: "@admin/page.tsx가 서버 CPU 로드와 DB 커넥션 풀 42 / 100 같은 운영 지표를 렌더링합니다.",
            actionBadge: "@admin",
          },
          {
            step: 2,
            title: "[@user] 사용자 슬롯 확인",
            description: "@user/page.tsx가 보유 포인트 15,400 P (3장)와 배송 중 1건을 렌더링합니다.",
            actionBadge: "@user",
            observe: "두 슬롯이 동일 레이아웃의 grid 안에서 서로 다른 데이터를 동시에 표시 — 한쪽을 교체해도 다른 쪽 렌더링에 영향이 없음",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"권한별 조건부 슬롯 분기 (Parallel Routes) 실습"}>
        <ParallelConditionalDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
