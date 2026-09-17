import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/headers/user-agent-device')

import React from 'react'
import { headers } from 'next/headers'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { HeadersUserAgentDemo } from './components/HeadersUserAgentDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { detectDeviceType, MOBILE_UA_PATTERN } from './deviceDetection'
import type { DeviceType } from './types'

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ device?: string }>
}) {
  const { device } = await searchParams
  const forcedDevice: DeviceType | null = device === 'mobile' || device === 'desktop' ? device : null

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') ?? ''
  const deviceType = detectDeviceType(userAgent)

  const isMatched = MOBILE_UA_PATTERN.test(userAgent) === (deviceType === 'mobile')

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="headers().get('user-agent') 기기 식별 및 최적화"
        concept="proxy.ts가 쿼리 파라미터에 따라 실제 요청의 User-Agent 헤더를 모바일/데스크톱 값으로 바꿔서 넘겨주면, 서버 컴포넌트가 headers().get('user-agent')로 그 값을 읽어 기기별로 다른 상품 상세 뷰를 서버에서 미리 렌더링합니다."
        steps={[
          {
            step: 1,
            title: '[모바일로 보기] 클릭',
            description: 'proxy.ts가 이 요청의 User-Agent 헤더를 실제 모바일 기기 값으로 바꿔서 서버 컴포넌트에 전달합니다.',
            actionBadge: 'User-Agent 오버라이드',
          },
          {
            step: 2,
            title: '[데스크톱으로 보기] 클릭',
            description: '같은 방식으로 데스크톱 User-Agent로 바뀌면서 상품 상세 뷰가 함께 바뀌는지 확인합니다.',
            actionBadge: '뷰 전환 확인',
          },
          {
            step: 3,
            title: '[실제 브라우저 값 사용] 클릭 후 검증 패널 대조',
            description: '이번엔 헤더를 건드리지 않아, 지금 사용 중인 실제 브라우저의 User-Agent로 판별됩니다. headers()가 읽은 원문과 판별 결과가 매번 일치하는지 관찰합니다.',
            actionBadge: '원본 헤더 확인',
            observe: "headers().get('user-agent') 원문과 판별된 기기 타입(mobile/desktop)이 함께 바뀜",
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="상품 상세 — User-Agent 기반 기기별 뷰 전환 실습">
        <HeadersUserAgentDemo userAgent={userAgent} deviceType={deviceType} forcedDevice={forcedDevice} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={isMatched}
        expected="headers().get('user-agent')로 읽은 원문에 모바일 기기 패턴이 있으면 판별 결과가 반드시 'mobile'이어야 하고, 없으면 반드시 'desktop'이어야 한다."
        actual={`- User-Agent 원문: ${userAgent || '(없음)'}\n- 판별된 기기 타입: ${deviceType}\n- 강제 지정 여부: ${forcedDevice ? `쿼리 파라미터로 ${forcedDevice} 강제` : '없음(실제 브라우저 값)'}`}
      />
    </DemoContainer>
  )
}
