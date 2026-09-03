import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/image-response/dynamic-receipt')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ImageResponseReceiptDemo } from './components/ImageResponseReceiptDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="ImageResponse 동적 결제 영수증 이미지 생성"
        concept="Satori/Resvg 엔진 기반 ImageResponse를 사용하여 주문 번호(ORD-2026-9912)와 결제액(349,000원)이 포함된 모바일 전자 영수증 PNG 바이너리를 50ms 이내에 동적 생성합니다."
        steps={[
          {
                    "step": 1,
                    "title": "디지털 결제 영수증 파라미터 명세 점검 및 ImageResponse Satori JSX 레이아웃 렌더링",
                    "description": "주문번호(ORD-2026-9912) 및 결제금액(349,000원) 등의 영수증 데이터 페이로드를 확인합니다. Satori Flexbox CSS와 JSX 템플릿을 통해 전자 영수증 규격의 PNG 바이너리 스트림을 생성합니다.",
                    "actionBadge": "파라미터 점검"
          },
          {
                    "step": 2,
                    "title": "전자 결제 영수증 PNG 생성 및 다운로드 지원 관찰",
                    "description": "클라이언트 위변조가 불가능한 서버 서명 영수증 이미지가 소셜 메신저 및 다운로드 규격으로 생성되는지 확인합니다.",
                    "actionBadge": "영수증 검증",
                    "observe": "주문 결제 데이터가 주입된 ImageResponse 전자 영수증 PNG 바이너리가 정상 생성됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"ImageResponse 동적 결제 영수증 이미지 생성 실습"}>
        <ImageResponseReceiptDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
