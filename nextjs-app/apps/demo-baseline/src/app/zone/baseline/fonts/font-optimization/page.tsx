import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'fonts/font-optimization')

import React from 'react'
import { Noto_Sans_KR } from 'next/font/google'
import localFont from 'next/font/local'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FontPreviewClient } from './components/FontPreviewClient'

// 2. next/font/google — 빌드 타임에 Noto Sans KR을 실제로 다운로드해 셀프호스팅한다.
// Noto Sans KR은 가변 폰트가 아니라서 필요한 굵기를 배열로 명시해야 한다.
const notoSansKr = Noto_Sans_KR({
  weight: ['400', '700', '900'],
  display: 'swap',
})

// 3. next/font/local — 저장소에 직접 번들링한 로컬 폰트 파일(Gaegu, SIL OFL 1.1 라이선스)을 셀프호스팅한다.
const gaegu = localFont({
  src: [
    { path: './assets/fonts/Gaegu-Regular.ttf', weight: '400', style: 'normal' },
    { path: './assets/fonts/Gaegu-Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
})

export default function FontOptimizationDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="next/font 자동 셀프호스팅 & 폴백 메트릭 보정 기반 Zero CLS 폰트 로딩"
        concept="next/font는 Google Fonts 및 로컬 폰트 파일을 빌드 타임에 자동 다운로드하여 셀프호스팅하고, 폴백 폰트 치수를 자동 보정(adjustFontFallback)해 폰트 로딩 중 레이아웃 흔들림(CLS)을 방지합니다."
        steps={[
          {
            step: 1,
            title: '3대 폰트 로딩 방식(외부 CDN vs next/font/google vs next/font/local) 대조',
            description: '실제로 서로 다른 3개의 한글 폰트(외부 CDN: 나눔명조 / next/font/google: Noto Sans KR / next/font/local: Gaegu)가 로드되는 걸 눈으로 비교합니다.',
            actionBadge: '로딩 구조 비교',
          },
          {
            step: 2,
            title: '[400], [700], [900] 굵기(weight) 버튼 클릭',
            description: '각 카드에 실제로 로드된 폰트가 굵기별로 어떻게 렌더링되는지 확인합니다 (폰트별로 지원하는 굵기가 다를 수 있습니다).',
            actionBadge: '굵기별 렌더링 비교',
          },
          {
            step: 3,
            title: '브라우저 개발자 도구 네트워크 탭으로 실제 요청 대조',
            description: '외부 CDN 카드만 fonts.googleapis.com/fonts.gstatic.com으로 실제 요청이 나가고, next/font 카드 2개는 이 zone과 같은 도메인(_next/static/media)에서 로드되는 걸 확인합니다.',
            actionBadge: 'Zero CLS 검증',
            observe: '외부 CDN 카드만 구글 도메인으로 실제 폰트 요청이 나가고, next/font/google·next/font/local 카드는 외부 요청 없이 동일 도메인에서 폰트가 로드됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) 및 3단/4단 */}
      <DemoPlaygroundCard title="Next.js 웹 폰트 로딩 및 렌더링 시뮬레이터" className="space-y-4">
        <FontPreviewClient
          nextFontGoogleClassName={notoSansKr.className}
          nextFontLocalClassName={gaegu.className}
        />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
