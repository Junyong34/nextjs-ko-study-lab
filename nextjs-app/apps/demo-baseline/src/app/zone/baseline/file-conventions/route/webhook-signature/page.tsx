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
        title={"Webhook 서명 검증 핸들러 (route.ts)"}
        concept={"클라이언트가 Web Crypto API로 페이로드에 HMAC-SHA256 서명을 만들어 x-signature-sha256 헤더로 보내면, route.ts가 같은 시크릿으로 다시 계산해 대조합니다. 값이 다르면 본문을 신뢰하지 않고 401로 거절합니다."}
        steps={[
          {
            step: 1,
            title: "[1. 정상 서명 웹훅 전송 (200 OK 기대)] 클릭",
            description: "올바른 시크릿으로 서명한 페이로드를 전송해 서버 검증을 통과시킵니다.",
            actionBadge: "VALID",
          },
          {
            step: 2,
            title: "[2. 변조된 서명 웹훅 전송 (401 거절 기대)] 클릭",
            description: "서명을 훼손해 보냅니다. 서버가 재계산한 해시와 헤더 값이 어긋납니다.",
            actionBadge: "TAMPERED",
            observe: "동일한 엔드포인트가 서명 일치 여부만으로 200과 401로 갈리는지, 거절 시 응답 본문에 처리 결과가 남지 않는지 확인",
            observeAt: "verification",
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
