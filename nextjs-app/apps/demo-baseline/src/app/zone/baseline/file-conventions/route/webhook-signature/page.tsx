'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { WebhookSignatureDemo } from './components/WebhookSignatureDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  const [status, setStatus] = useState<{
    httpStatus: number | null
    verified: boolean
    eventName?: string
  }>({
    httpStatus: null,
    verified: false,
  })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Webhook 서명 검증 핸들러 (route.ts)"
        concept="외부 PG사 결제 노티피케이션 등 비동기 웹훅을 수신할 때, HMAC-SHA256 암호화 서명을 검증하여 요청의 위변조를 방지하는 실습입니다."
        steps={[
          {
            step: 1,
            title: "route.ts 웹훅 핸들러 선언",
            description: "api/route.ts에서 POST 요청을 수신하고 request.text()로 원본 본문을 추출합니다.",
            actionBadge: "핸들러 선언",
          },
          {
            step: 2,
            title: "HMAC-SHA256 서명 검증",
            description: "crypto.timingSafeEqual을 통해 헤더의 서명과 비밀키로 계산한 해시값을 안전하게 비교합니다.",
            actionBadge: "서명 대조",
          },
          {
            step: 3,
            title: "정상 승인 및 위조 차단 검증",
            description: "정상 서명(200 OK)과 변조 서명(401 Unauthorized)에 따른 응답 차이를 확인합니다.",
            actionBadge: "검증 결과",
          },
        ]}
      />
      <DemoPlaygroundCard title="Webhook 서명 검증 핸들러 (route.ts) 실습">
        <WebhookSignatureDemo onStatusChange={setStatus} />
      </DemoPlaygroundCard>
      <VerificationFooter
        httpStatus={status.httpStatus}
        verified={status.verified}
        eventName={status.eventName}
      />
    </DemoContainer>
  )
}
