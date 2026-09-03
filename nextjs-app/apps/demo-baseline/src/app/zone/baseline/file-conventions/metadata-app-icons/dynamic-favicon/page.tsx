import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/metadata-app-icons/dynamic-favicon')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MetadataAppIconsDemo } from './components/MetadataAppIconsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"icon.tsx & apple-icon.tsx 동적 파비콘 생성"}
        concept={"ImageResponse를 활용하여 쇼핑몰 브랜드 로고와 장바구니 알림 뱃지 숫자가 포함된 파비콘(32x32) 및 Apple Touch Icon을 서버에서 동적으로 생성합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "icon.tsx 파비콘 생성 사양 확인 및 apple-icon.tsx 터치 아이콘 사양 확인",
                    "description": "ImageResponse API가 32x32 크기의 PNG 파비콘 이미지를 동적으로 렌더링하는 구조를 확인합니다. iOS 홈 화면 바로가기용 180x180 해상도의 고화질 아이콘 생성 로직을 확인합니다.",
                    "actionBadge": "icon.tsx"
          },
          {
                    "step": 2,
                    "title": "동적 메타데이터 아이콘 태그 검증",
                    "description": "HTML <head> 내부에 <link rel=\\\"icon\\\"> 및 <link rel=\\\"apple-touch-icon\\\">이 자동 주입되는지 확인합니다.",
                    "actionBadge": "태그 검증",
                    "observe": "3단 검증 패널에서 dynamic favicon 및 apple-icon 생성 사양이 정상 반영되는지 확인",
                    "observeAt": "verification"
          }
]}
        />
      <DemoPlaygroundCard title={"icon.tsx 동적 파비콘 생성 실습"}>
        <MetadataAppIconsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
