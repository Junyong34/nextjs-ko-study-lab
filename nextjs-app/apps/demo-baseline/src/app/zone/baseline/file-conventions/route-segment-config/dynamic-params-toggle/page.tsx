import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/route-segment-config/dynamic-params-toggle')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DynamicParamsToggleDemo } from './components/DynamicParamsToggleDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"export const dynamicParams = true | false"}
        concept={"generateStaticParams()에 명시되지 않은 동적 세그먼트 ID 요청 시 404를 반환할지(false), 아니면 온디맨드 서버 렌더링할지(true)를 제어합니다."}
        steps={[
        {
        "step": 1,
        "title": "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
        "description": "사전 생성된 정적 파라미터 항목을 선택합니다.",
        "actionBadge": "정적 항목"
        },
        {
        "step": 2,
        "title": "[+] 수량 조절 후 [동작 실행] 클릭",
        "description": "미생성 파라미터 요청을 시뮬레이션하여 dynamicParams 분기 로직을 실행합니다.",
        "actionBadge": "동작 실행"
        },
        {
        "step": 3,
        "title": "dynamicParams false 시 404 차단 확인",
        "description": "false 설정 시 정의되지 않은 ID가 즉시 404로 거절되고, true 설정 시 SSR로 렌더링되는지 확인합니다.",
        "actionBadge": "404 검증",
        "observe": "3단 검증 패널에서 dynamicParams 설정에 따른 미생성 파라미터 처리 결과 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"dynamicParams true vs false 설정 실습"}>
        <DynamicParamsToggleDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
