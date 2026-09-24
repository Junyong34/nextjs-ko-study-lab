import React from 'react'
import { DemoContainer, DemoPlaygroundCard } from '@study/demo-kit'
import { ReceiptProbe } from '../components/ReceiptProbe'

/**
 * pg-sdk-onload의 실제 하위 라우트. 이 페이지에는 <Script>가 없으므로
 * Link로 들어오면 결제 페이지의 SDK 호스트 컴포넌트가 실제로 언마운트된다.
 */
export default function ReceiptPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoPlaygroundCard title="주문 내역 (SDK를 쓰지 않는 하위 라우트)">
        <ReceiptProbe />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
