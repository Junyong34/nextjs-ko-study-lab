import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/image/blur-placeholder')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ImageBlurPlaceholderDemo } from './components/ImageBlurPlaceholderDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"next/image blurDataURL 블러 플레이스홀더"}
        concept={"<Image placeholder=\"blur\" blurDataURL=\"...\"> 설정을 적용하여 고해상도 이미지가 로드되기 전 저용량 블러 프리뷰를 0ms 즉시 노출하고 CLS를 0으로 방지합니다."}
        steps={[
        {
        "step": 1,
        "title": "블러 플레이스홀더 렌더링 확인",
        "description": "이미지 다운로드 완료 전 Base64 인코딩된 블러 이미지가 0ms에 즉시 표시되는 것을 확인합니다.",
        "actionBadge": "블러 0ms"
        },
        {
        "step": 2,
        "title": "[로드 상태 토글] 클릭",
        "description": "이미지 로드 완료 상태를 시뮬레이션하여 블러 프리뷰에서 원본 이미지로 페이드인 전환합니다.",
        "actionBadge": "로드 토글"
        },
        {
        "step": 3,
        "title": "CLS 방지 및 부드러운 전환 검증",
        "description": "고정된 종횡비 컨테이너 덕분에 이미지 로드 전후 레이아웃 이동(CLS: 0)이 없는지 확인합니다.",
        "actionBadge": "CLS 0 검증",
        "observe": "3단 검증 패널에서 placeholder='blur' 적용에 따른 로딩 상태 및 CLS 방지 결과 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"placeholder='blur' 저용량 블러 미리보기 실습"}>
        <ImageBlurPlaceholderDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
