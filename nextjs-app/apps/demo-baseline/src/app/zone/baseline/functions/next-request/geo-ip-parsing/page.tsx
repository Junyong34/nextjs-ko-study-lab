'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { NextRequestGeoDemo } from './components/NextRequestGeoDemo'
import { VerificationFooter } from './components/VerificationFooter'
import type { GeoStatus } from './types'

export default function DemoPage() {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>({
    country: null,
    ip: null,
    currency: null,
    hasFetched: false,
  })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="NextRequest Geo 위치 및 클라이언트 IP 파싱"
        concept="NextRequest에는 더 이상 geo/ip 속성이 없습니다(v15.0.0에서 제거). 지금은 Vercel이 엣지에서 주입하는 x-vercel-ip-country 같은 헤더를 request.headers로 직접 읽어 국가별 통화를 결정합니다."
        steps={[
          {
            step: 1,
            title: "[헤더 없음 (dev 기본값)] 클릭",
            description: "추가 헤더 없이 요청을 보내, 로컬 dev 환경에는 Geo 헤더가 원래 비어있다는 사실을 먼저 확인합니다.",
            actionBadge: "기본 상태 확인",
          },
          {
            step: 2,
            title: "[KR 🇰🇷], [US 🇺🇸], [JP 🇯🇵], [DE 🇩🇪] 국가 선택",
            description: "브라우저 fetch()가 x-vercel-ip-country 등 실제 헤더를 요청에 실어 보냅니다.",
            actionBadge: "헤더 전송",
          },
          {
            step: 3,
            title: "서버가 읽은 값과 통화(KRW/USD/JPY/EUR) 확인",
            description: "route.ts가 request.headers.get()으로 읽은 값이 내가 보낸 헤더와 일치하는지, 통화·현지 가격이 그에 따라 바뀌는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "보낸 헤더 값 = 서버가 읽은 값이 정확히 일치하고, country에 따라 통화 표기가 바뀜",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title="NextRequest.headers 기반 IP/Geo 파싱 실습">
        <NextRequestGeoDemo onStatusChange={setGeoStatus} />
      </DemoPlaygroundCard>
      <VerificationFooter status={geoStatus} />
    </DemoContainer>
  )
}
