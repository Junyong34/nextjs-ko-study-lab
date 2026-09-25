import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/proxy/gateway-router')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProxyGatewayDemo } from './components/ProxyGatewayDemo'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="proxy.ts로 구현하는 API 게이트웨이 경로 라우팅"
        concept="proxy.ts는 렌더링 전에 요청 경로 접두사(/api/orders, /api/inventory, /api/search)를 판독해 NextResponse.rewrite()로 서로 다른 내부 마이크로서비스 Route Handler에 투명하게 연결한다."
        steps={[
          {
            step: 1,
            title: '[주문 서비스], [재고 서비스], [검색 서비스] 중 선택',
            description: '경로 접두사가 다른 요청을 골라 게이트웨이 라우팅 테이블을 확인합니다.',
            actionBadge: '접두사 선택',
          },
          {
            step: 2,
            title: '[알 수 없는 서비스 (미매핑)] 선택',
            description: '라우팅 테이블에 없는 접두사를 요청해 proxy.ts가 임의로 응답을 만들지 않고 그대로 통과시켜 자연스러운 404가 나는지 확인합니다.',
            actionBadge: '미매핑 경로',
          },
          {
            step: 3,
            title: '응답 헤더 및 검증 패널 확인',
            description: 'x-gateway-target-service 등 실제 응답 헤더가 기대한 내부 서비스와 일치하는지 3단 검증 패널에서 대조합니다.',
            actionBadge: '헤더 검증',
            observe: 'proxy.ts가 rewrite한 실제 서비스 식별자와 HTTP 상태 코드',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="내부 마이크로서비스 프록시 라우팅 (proxy.ts) 실습">
        <ProxyGatewayDemo />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
