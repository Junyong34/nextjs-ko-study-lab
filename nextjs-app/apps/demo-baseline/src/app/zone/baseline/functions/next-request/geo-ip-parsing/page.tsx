'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { NextRequestGeoDemo } from './components/NextRequestGeoDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  const [geoState, setGeoState] = useState<{
    ip?: string
    country?: string
    currency?: string
    isLoaded: boolean
  }>({
    isLoaded: false,
  })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="NextRequest IP/Geo 텔레메트리 파싱 (route.ts)"
        concept="Next.js App Router route.ts의 NextRequest 객체로부터 클라이언트 IP(request.ip) 및 지리적 위치(request.geo/헤더)를 파싱하여 이커머스 통화 및 가격을 자동 현지화하는 실습입니다."
        steps={[
          {
            step: 1,
            title: "NextRequest 핸들러 선언",
            description: "api/route.ts에서 NextRequest를 파라미터로 받아 ip, geo, headers를 추출합니다.",
            actionBadge: "핸들러 수신",
          },
          {
            step: 2,
            title: "지리 정보 기반 통화 매핑",
            description: "감지된 국가 코드(KR/US/JP/EU)에 맞춰 통화 단위와 환율을 자동 매핑합니다.",
            actionBadge: "통화 현지화",
          },
          {
            step: 3,
            title: "텔레메트리 검증",
            description: "클라이언트에서 실시간 수신된 IP, 국가, 포맷팅 가격 정보를 대조 검증합니다.",
            actionBadge: "데이터 대조",
          },
        ]}
      />
      <DemoPlaygroundCard title="NextRequest IP/Geo 텔레메트리 파싱 실습">
        <NextRequestGeoDemo onStatusChange={setGeoState} />
      </DemoPlaygroundCard>
      <VerificationFooter
        ip={geoState.ip}
        country={geoState.country}
        currency={geoState.currency}
        isLoaded={geoState.isLoaded}
      />
    </DemoContainer>
  )
}
