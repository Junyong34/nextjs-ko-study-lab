'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ImageResponseOgBadgeDemo } from './components/ImageResponseOgBadgeDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { INITIAL_OG_BADGE_RESPONSE_STATE, type OgBadgeResponseState } from './types'

export default function DemoPage() {
  const [responseState, setResponseState] = useState<OgBadgeResponseState>(
    INITIAL_OG_BADGE_RESPONSE_STATE,
  )

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="ImageResponse를 활용한 실시간 할인 뱃지 OG 이미지"
        concept="next/og의 ImageResponse는 요청마다 JSX를 Satori/Resvg로 즉시 PNG 바이너리로 변환합니다. 같은 화면을 다시 그리는 게 아니라, 요청 쿼리 파라미터(할인율)를 읽어 그때그때 다른 PNG 바이트를 만들어 돌려줍니다."
        steps={[
          {
            step: 1,
            title: '[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택',
            description: 'OG 뱃지를 생성할 대상 상품을 선택합니다.',
            actionBadge: '상품 선택',
          },
          {
            step: 2,
            title: '[10%] ~ [70%] 중 할인율 선택 후 [OG 이미지 생성] 클릭',
            description: 'api/route.tsx로 실제 GET 요청을 보내 ImageResponse가 렌더링한 PNG를 받아옵니다.',
            actionBadge: 'OG 렌더링',
          },
          {
            step: 3,
            title: '같은 할인율로 다시 [OG 이미지 생성] 클릭',
            description: '파라미터를 바꾸지 않아도 요청 번호와 Content-Length가 달라지는지 확인합니다.',
            actionBadge: '재생성 비교',
            observe: '요청마다 x-study-og-request-seq가 증가하고, 할인율을 바꾸면 응답 PNG의 Content-Length도 함께 달라짐',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="ImageResponse를 활용한 실시간 할인 뱃지 OG 이미지 실습">
        <ImageResponseOgBadgeDemo onResponseChange={setResponseState} />
      </DemoPlaygroundCard>
      <VerificationFooter {...responseState} />
    </DemoContainer>
  )
}
