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
        title={"route.ts RESTful 주문 CRUD API 핸들러"}
        concept={"app/api/orders/route.ts에서 GET, POST Web Standard Request/Response 메서드를 선언하여 주문 목록 조회와 신규 주문 생성을 처리합니다."}
        steps={[
        {
        "step": 1,
        "title": "[러닝화 (#001)], [윈드브레이커 (#002)], [백팩 (#003)] 중 선택",
        "description": "주문할 상품과 수량을 설정합니다.",
        "actionBadge": "상품 설정"
        },
        {
        "step": 2,
        "title": "[POST 주문 전송] 클릭",
        "description": "route.ts의 POST 핸들러로 JSON 페이로드를 전송하여 새 주문을 등록합니다.",
        "actionBadge": "POST 전송"
        },
        {
        "step": 3,
        "title": "[GET 목록 새로고침] 클릭",
        "description": "route.ts의 GET 핸들러를 호출하여 최신 주문 목록 200 OK 응답을 확인합니다.",
        "actionBadge": "GET 갱신",
        "observe": "POST 주문 성공 후 GET 주문 목록에 신규 주문 건이 즉시 추가되는지 대조",
        "observeAt": "playground"
        }
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
