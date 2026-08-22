import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ParallelIndependentTabsDemo } from './components/ParallelIndependentTabsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"독립 탭 네비게이션 슬롯 (Parallel Routes)"}
        concept={"쇼핑몰 라우팅 계층에서 Next.js 특수 파일 컨벤션 '독립 탭 네비게이션 슬롯 (Parallel Routes)'을 적용하여 URL 구조와 렌더링 수명 주기를 제어하는 실습입니다."}
        steps={[
          {
                    "step": 1,
                    "title": "라우트 파일 컨벤션 확인",
                    "description": "해당 특수 파일이 담당하는 라우트 위치와 역할을 점검합니다.",
                    "actionBadge": "파일 확인"
          },
          {
                    "step": 2,
                    "title": "라우팅 및 상태 전이 실행",
                    "description": "페이지 이동, 파라미터 변경 또는 에러 트리거를 실행합니다.",
                    "actionBadge": "라우팅 실행"
          },
          {
                    "step": 3,
                    "title": "파일 컨벤션 런타임 검증",
                    "description": "Next.js 런타임이 해당 파일을 어떻게 해석하여 화면에 마운트하는지 검증합니다.",
                    "actionBadge": "컨벤션 검증"
          }
]}
      />
      <DemoPlaygroundCard title={"독립 탭 네비게이션 슬롯 (Parallel Routes) 실습"}>
        <ParallelIndependentTabsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
