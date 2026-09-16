import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/image-response/dynamic-receipt')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ReceiptDemo } from './components/ReceiptDemo'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="ImageResponse 동적 결제 영수증 이미지 생성"
        concept="next/og의 ImageResponse는 Route Handler(api/route.tsx)에서 요청마다 서버가 직접 JSX를 렌더링해 PNG를 반환합니다. 같은 상품을 골라도 매번 새 주문번호로 요청하므로 응답 바이트가 매번 달라집니다."
        steps={[
          {
            step: 1,
            title: '[상품 · 수량 · 쿠폰 · 결제수단] 조합 선택',
            description: '실제 계산 대상이 되는 주문 파라미터를 조합합니다. 조합에 따라 서버가 합계·할인·배송비·최종 금액을 다시 계산합니다.',
            actionBadge: '주문 구성',
          },
          {
            step: 2,
            title: '[영수증 생성 (ImageResponse 요청)] 클릭',
            description: 'GET /api?orderId=...&productId=... 요청이 실제로 전송되고, 응답 PNG의 크기·Content-Type·Cache-Control·SHA-256 해시를 클라이언트가 직접 측정합니다.',
            actionBadge: 'PNG 생성',
            observe: '두 번째 생성부터 직전 응답과 SHA-256 해시가 달라짐 — 동일 상품이어도 매 요청 바이트가 다름',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '[잘못된 상품 ID로 요청 (실패 케이스)] 클릭',
            description: '존재하지 않는 상품 ID로 같은 엔드포인트를 호출해 서버 검증이 이미지 대신 4xx JSON 에러를 반환하는지 확인합니다.',
            actionBadge: '실패 케이스',
            observe: 'HTTP 404와 에러 메시지가 검증 패널에 그대로 표시됨',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="ImageResponse 동적 결제 영수증 이미지 생성 실습 (api/route.tsx)">
        <ReceiptDemo />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
