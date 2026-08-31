import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FontPreviewClient } from './components/FontPreviewClient'

export default function FontOptimizationDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="next/font 자동 셀프호스팅 & size-adjust 기반 Zero CLS 폰트 로딩"
        concept="next/font는 Google Fonts 및 로컬 WOFF2 폰트를 빌드 타임에 자동 다운로드하여 셀프호스팅하고, size-adjust CSS 보정으로 폰트 로딩 중 레이아웃 흔들림(CLS 0)을 완벽 방지합니다."
        steps={[
          {
            step: 1,
            title: '3대 폰트 로딩 방식(외부 CDN vs Google vs Local) 대조',
            description: '외부 CDN 방식의 렌더링 블로킹과 next/font의 셀프호스팅 및 WOFF2 로컬 번들링 구조를 비교합니다.',
            actionBadge: '로딩 구조 비교',
          },
          {
            step: 2,
            title: '[400], [700], [900] 굵기(weight) 버튼 클릭',
            description: '상단 툴바에서 [400], [700], [900] 버튼을 클릭하여 단일 가변 폰트(Variable Font)의 실시간 굵기 렌더링을 확인합니다.',
            actionBadge: '가변 폰트 제어',
          },
          {
            step: 3,
            title: 'Zero CLS 및 셀프호스팅 메트릭 관찰',
            description: '외부 fonts.googleapis.com 요청이 제거되고 CSS size-adjust로 레이아웃 이동 없이 렌더링되는 것을 관찰합니다.',
            actionBadge: 'Zero CLS 검증',
            observe: '외부 CDN 요청 없이 동일 도메인에서 가변 폰트가 로드되며 CSS size-adjust 보정으로 레이아웃 이동(CLS 0) 없이 선택 굵기가 정상 렌더링됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) 및 3단/4단 */}
      <DemoPlaygroundCard title="Next.js 웹 폰트 로딩 및 렌더링 시뮬레이터" className="space-y-4">
        <FontPreviewClient />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
