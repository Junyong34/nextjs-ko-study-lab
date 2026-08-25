'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { NextResponseRewriteDemo } from './components/NextResponseRewriteDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  const [rewriteState, setRewriteState] = useState<{
    isRewritten: boolean
    targetRoute?: string
    httpStatus: number | null
  }>({
    isRewritten: false,
    httpStatus: null,
  })

  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="NextResponse.rewrite() 가상 라우팅 중계"
        concept="NextResponse.rewrite()를 활용하여 브라우저 주소창의 URL은 그대로 유지한 채 서버 내부에서 다른 가상 엔드포인트나 백엔드 서비스의 컨텐츠를 프록시 서빙합니다."
        steps={[
          {
            step: 1,
            title: "[가상 엔드포인트 호출] 클릭",
            description: "NextResponse.rewrite()가 구성된 프록시 엔드포인트로 요청을 전송합니다.",
            actionBadge: "리라이트 요청",
          },
          {
            step: 2,
            title: "브라우저 표시 URL 보존 확인",
            description: "클라이언트 브라우저 주소창의 URL이 변경되지 않고 유지되는 것을 확인합니다.",
            actionBadge: "URL 보존",
          },
          {
            step: 3,
            title: "가상 내부 서비스 응답 서빙 관찰",
            description: "내부 마이크로서비스 또는 가상 경로의 데이터가 투명하게 프록시 서빙되는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "브라우저 URL 변경 없이 내부 대상 엔드포인트의 리라이트 응답 데이터가 정상 수신됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title="NextResponse.rewrite() 가상 경로 라우팅 실습">
        <NextResponseRewriteDemo onStatusChange={setRewriteState} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isRewritten={rewriteState.isRewritten}
        targetRoute={rewriteState.targetRoute}
        httpStatus={rewriteState.httpStatus}
      />
    </DemoContainer>
  )
}
