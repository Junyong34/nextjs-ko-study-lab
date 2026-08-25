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
        title="NextResponse.json() 응답 빌더 및 상태 코드 주입"
        concept="NextResponse.json(data, { status: 200, headers }) 팩토리를 사용하여 표준 Content-Type: application/json 헤더와 커스텀 HTTP 상태 코드를 주입한 JSON 응답을 생성합니다."
        steps={[
          {
            step: 1,
            title: "[200 OK (성공)] 또는 [201 Created (생성)] 클릭",
            description: "성공 상태 코드를 주입하는 NextResponse.json() 응답 생성을 요청합니다.",
            actionBadge: "성공 응답",
          },
          {
            step: 2,
            title: "[400 Bad Request (검증실패)] 또는 [422 Unprocessable (도메인오류)] 클릭",
            description: "에러 규격화 상태 코드가 주입된 NextResponse.json() 응답을 요청합니다.",
            actionBadge: "에러 응답",
          },
          {
            step: 3,
            title: "HTTP 헤더 및 직렬화된 JSON 페이로드 관찰",
            description: "반환된 응답의 x-study-response-builder 헤더, 상태 코드 및 JSON 본문이 일치하는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "NextResponse.json()으로 생성된 상태 코드와 JSON 응답 구조가 정상 반환됨",
            observeAt: "verification",
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
