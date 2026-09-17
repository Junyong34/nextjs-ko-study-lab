'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RouteOrdersDemo } from './components/RouteOrdersDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { INITIAL_DEMO_STATUS, type DemoStatus } from './types'

export default function DemoPage() {
  const [demoState, setDemoState] = useState<DemoStatus>(INITIAL_DEMO_STATUS)

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="route.ts RESTful 주문 CRUD API 핸들러"
        concept="app/.../rest-api-orders/api/route.ts에서 GET, POST 함수를 export해 같은 경로의 요청을 메서드별로 분기 처리합니다. POST로 만든 주문은 서버 메모리에만 반영되므로, GET을 다시 호출해야 화면에 나타납니다."
        steps={[
          {
            step: 1,
            title: '[러닝화 (#001)], [윈드브레이커 (#002)], [백팩 (#003)] 중 선택',
            description: '주문할 상품과 수량을 설정합니다.',
            actionBadge: '상품 설정',
          },
          {
            step: 2,
            title: '[POST 주문 전송] 클릭',
            description: 'route.ts의 POST 핸들러로 JSON 페이로드를 전송해 새 주문을 등록합니다. 화면의 주문 목록은 아직 바뀌지 않습니다.',
            actionBadge: 'POST 전송',
            observe: 'HTTP 상태 뱃지가 201로 바뀌는지, 3단 검증 패널이 "대기 중"으로 바뀌는지',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[GET 목록 새로고침] 클릭',
            description: 'route.ts의 GET 핸들러를 다시 호출해 서버가 실제로 갖고 있는 최신 주문 목록을 받아옵니다.',
            actionBadge: 'GET 갱신',
            observe: '방금 만든 주문 ID가 목록에 나타나고 3단 검증 패널이 "검증 완료"로 바뀌는지',
            observeAt: 'verification',
          },
          {
            step: 4,
            title: '[잘못된 상품으로 주문 시도] 클릭',
            description: '카탈로그에 없는 상품 ID(PROD-999)로 POST를 보내 route.ts의 유효성 검사 실패 경로를 확인합니다.',
            actionBadge: '400 확인',
            observe: 'route.ts가 201이 아닌 400 Bad Request로 요청을 거부하는지',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="REST GET/POST 주문 API (route.ts) 실습">
        <RouteOrdersDemo onStatusChange={setDemoState} />
      </DemoPlaygroundCard>
      <VerificationFooter status={demoState} />
    </DemoContainer>
  )
}
