import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/route-segment-config/max-duration-timeout')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MaxDurationTimeoutDemo } from './components/MaxDurationTimeoutDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"export const maxDuration 서버리스 실행 제한 시간"}
        concept={"Vercel 서버리스 함수 실행 제한 시간을 maxDuration = 60초로 설정하여 대용량 PDF 생성이나 외부 PG사 연동 시 504 Gateway Timeout을 방지합니다."}
        steps={[
        {
        "step": 1,
        "title": "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
        "description": "실행 시간이 긴 작업을 수행할 상품 데이터를 선택합니다.",
        "actionBadge": "데이터 선택"
        },
        {
        "step": 2,
        "title": "[+] 수량 조절 후 [동작 실행] 클릭",
        "description": "장시간 소요되는 서버리스 API 핸들러 호출을 트리거합니다.",
        "actionBadge": "API 호출"
        },
        {
        "step": 3,
        "title": "maxDuration 타임아웃 방지 및 200 완료 확인",
        "description": "maxDuration 설정으로 15초 이상의 비동기 작업이 504 에러 없이 200 OK로 완료되는지 확인합니다.",
        "actionBadge": "200 완료",
        "observe": "3단 검증 패널에서 maxDuration 설정값과 장기 실행 작업의 성공 상태 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"주문 정산 배치 maxDuration 타임아웃 제한 실습"}>
        <MaxDurationTimeoutDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
