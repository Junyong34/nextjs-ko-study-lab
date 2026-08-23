'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RouteOrdersDemo } from './components/RouteOrdersDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  const [demoState, setDemoState] = useState<{
    httpStatus: number | null
    orderCount: number
    lastMethod: string
  }>({
    httpStatus: null,
    orderCount: 0,
    lastMethod: 'GET',
  })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"REST GET/POST 주문 API (route.ts)"}
        concept={"api/route.ts 한 파일에 GET과 POST를 named export로 선언하면 같은 URL이 메서드별로 갈립니다. GET은 주문 목록을 200으로, POST는 생성 결과를 201로, 잘못된 상품 ID는 400으로 응답합니다."}
        steps={[
          {
            step: 1,
            title: "[GET 목록 새로고침] 클릭",
            description: "route.ts의 GET 핸들러가 기존 주문 ORD-2026-001을 200 OK로 반환합니다.",
            actionBadge: "GET 200",
          },
          {
            step: 2,
            title: "[러닝화 (#001)] 선택 후 수량 [+] 조정",
            description: "전송할 productId와 quantity를 정합니다.",
            actionBadge: "요청 본문",
          },
          {
            step: 3,
            title: "[POST 주문 전송] 클릭",
            description: "POST 핸들러가 PRODUCT_CATALOG를 검증하고 새 주문을 만들어 201 CREATED로 응답합니다.",
            actionBadge: "POST 201",
            observe: "우측 로그의 HTTP 상태 배지가 GET 200 → POST 201로 바뀌고, 총 주문 건수가 1건 증가하는지 대조",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title="REST GET/POST 주문 API (route.ts) 실습">
        <RouteOrdersDemo onStatusChange={setDemoState} />
      </DemoPlaygroundCard>
      <VerificationFooter
        httpStatus={demoState.httpStatus}
        orderCount={demoState.orderCount}
        lastMethod={demoState.lastMethod}
      />
    </DemoContainer>
  )
}
