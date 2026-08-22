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
        title="NextResponse.rewrite() 가상 경로 라우팅"
        concept="Next.js App Router route.ts에서 NextResponse.rewrite() 유틸리티를 사용하여 브라우저 URL 변경 없이 내부 엔드포인트(/target)로 요청을 투명하게 포워딩하는 실습입니다."
        steps={[
          {
            step: 1,
            title: "가상 엔드포인트 및 타겟 엔드포인트 선언",
            description: "api/route.ts와 target/route.ts를 각각 작성합니다.",
            actionBadge: "엔드포인트 준비",
          },
          {
            step: 2,
            title: "NextResponse.rewrite() 실행",
            description: "api/route.ts에서 new URL('/target')로 내부 리라이트를 수행합니다.",
            actionBadge: "리라이트 실행",
          },
          {
            step: 3,
            title: "URL 유지 및 타겟 데이터 수신 검증",
            description: "클라이언트가 호출한 URL은 그대로 유지되면서 타겟 데이터가 성공적으로 반환되는지 확인합니다.",
            actionBadge: "결과 검증",
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
