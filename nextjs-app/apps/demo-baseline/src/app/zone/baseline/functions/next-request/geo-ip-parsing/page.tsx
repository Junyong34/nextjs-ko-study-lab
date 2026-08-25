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
        title="NextRequest Geo 위치 및 클라이언트 IP 파싱"
        concept="NextRequest 객체의 request.geo 및 request.ip 속성을 0ms 내에 읽어 접속 국가(KR/US/JP), 도시, IP를 파싱하고 국가별 맞춤 통화와 배송비를 동적으로 설정합니다."
        steps={[
          {
            step: 1,
            title: "[KR 🇰🇷 한국], [US 🇺🇸 미국], [JP 🇯🇵 일본], [🇪🇺 유럽] 국가 선택",
            description: "Geo-IP 헤더를 시뮬레이션할 접속 국가 버튼을 클릭합니다.",
            actionBadge: "국가 선택",
          },
          {
            step: 2,
            title: "NextRequest geo 속성 파싱 확인",
            description: "request.geo.country 및 request.ip에서 추출된 지리적 메타데이터를 확인합니다.",
            actionBadge: "Geo 파싱",
          },
          {
            step: 3,
            title: "국가별 통화(KRW/USD/JPY/EUR) 및 배송 안내 관찰",
            description: "선택한 국가의 통화 단위와 로컬라이징 배송 정책이 화면에 즉시 동기화되는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "선택한 국가의 Geo-IP 정보에 따라 통화 기호 및 현지 배송비 정책이 화면에 일치함",
            observeAt: "playground",
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
