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
        title="REST GET/POST 주문 API (route.ts)"
        concept="Next.js App Router의 'route.ts' 특수 파일 컨벤션을 적용하여 웹 표준 기반의 REST API 엔드포인트를 구축하고, 클라이언트와 HTTP 비동기 통신을 수행합니다."
        steps={[
          {
            step: 1,
            title: "route.ts 파일 엔드포인트 확인",
            description: "api/route.ts 파일에서 export된 GET 및 POST 핸들러 함수를 점검합니다.",
            actionBadge: "엔드포인트",
          },
          {
            step: 2,
            title: "HTTP 통신 및 주문 전송",
            description: "GET 요청으로 주문 목록을 조회하고, POST 요청으로 새 주문을 등록합니다.",
            actionBadge: "HTTP 통신",
          },
          {
            step: 3,
            title: "응답 코드 및 상태 검증",
            description: "서버가 반환한 200 OK / 201 Created 응답 및 JSON 데이터를 검증합니다.",
            actionBadge: "응답 검증",
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
