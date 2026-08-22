'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { NextResponseJsonDemo } from './components/NextResponseJsonDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  const [responseState, setResponseState] = useState<{
    httpStatus: number | null
    builderHeader?: string | null
    isSuccess?: boolean
  }>({
    httpStatus: null,
  })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="NextResponse.json() 빌더 및 헤더"
        concept="Next.js App Router route.ts에서 NextResponse.json() 유틸리티를 사용하여 상태 코드와 커스텀 응답 헤더를 조립하고 JSON 객체를 반환하는 실습입니다."
        steps={[
          {
            step: 1,
            title: "NextResponse.json() 핸들러 선언",
            description: "api/route.ts에서 NextResponse.json(data, init)으로 응답을 구성합니다.",
            actionBadge: "빌더 선언",
          },
          {
            step: 2,
            title: "상태 코드 및 커스텀 헤더 주입",
            description: "200/201/400/422 상태 코드 및 x-study-response-builder 헤더를 제어합니다.",
            actionBadge: "헤더 제어",
          },
          {
            step: 3,
            title: "JSON 직렬화 및 클라이언트 수신 검증",
            description: "서버가 보낸 상태 코드와 헤더가 클라이언트에 정상 도달하는지 대조합니다.",
            actionBadge: "응답 검증",
          },
        ]}
      />
      <DemoPlaygroundCard title="NextResponse.json() 빌더 및 헤더 실습">
        <NextResponseJsonDemo onStatusChange={setResponseState} />
      </DemoPlaygroundCard>
      <VerificationFooter
        httpStatus={responseState.httpStatus}
        builderHeader={responseState.builderHeader}
        isSuccess={responseState.isSuccess}
      />
    </DemoContainer>
  )
}
