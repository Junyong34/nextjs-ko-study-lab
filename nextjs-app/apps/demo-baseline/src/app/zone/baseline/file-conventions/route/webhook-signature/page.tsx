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
        title={"route.ts HMAC SHA-256 결제 웹훅 서명 검증"}
        concept={"PG사 웹훅 수신 시 crypto.createHmac을 사용하여 x-webhook-signature 헤더의 위변조 여부를 검증하고 유효한 경우 200 OK, 변조된 경우 401을 반환합니다."}
        steps={[
        {
        "step": 1,
        "title": "[1. 정상 서명 웹훅 전송 (200 OK 기대) VALID] 클릭",
        "description": "올바른 시크릿 키로 서명된 헤더와 페이로드를 route.ts로 전송합니다.",
        "actionBadge": "200 VALID"
        },
        {
        "step": 2,
        "title": "[2. 변조된 서명 웹훅 전송 (401 거절 기대) TAMPERED] 클릭",
        "description": "서명이 위조된 가짜 웹훅 요청을 전송하여 서명 불일치 방어 로직을 실행합니다.",
        "actionBadge": "401 거절"
        },
        {
        "step": 3,
        "title": "웹훅 처리 결과 및 보안 로그 확인",
        "description": "정상 서명은 주문 완료(COMPLETED) 처리되고 위조 서명은 401 Unauthorized로 거절되는지 확인합니다.",
        "actionBadge": "결과 대조",
        "observe": "정상 웹훅의 200 OK 처리와 변조 웹훅의 401 거절이 3단 검증 패널에 정확히 기록되는지 확인",
        "observeAt": "verification"
        }
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
