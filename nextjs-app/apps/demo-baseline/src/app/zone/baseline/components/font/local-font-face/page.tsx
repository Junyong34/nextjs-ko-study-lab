import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/font/local-font-face')

import React from 'react'
import localFont from 'next/font/local'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FontLocalFontFaceDemo } from './components/FontLocalFontFaceDemo'

// next/font/local — 저장소에 직접 번들링한 로컬 WOFF2 2개 파일(Gaegu, SIL OFL 1.1 라이선스)을
// weight별로 매핑해 하나의 font-family로 셀프호스팅한다. localFont()는 이 파일 기준 상대 경로로
// src를 찾고, 빌드 타임에 각 weight마다 별도의 @font-face 규칙을 생성한다.
const gaeguLocal = localFont({
  src: [
    { path: './assets/fonts/Gaegu-Regular.woff2', weight: '400', style: 'normal' },
    { path: './assets/fonts/Gaegu-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-local-face-gaegu',
  display: 'swap',
})

// localFont()가 반환하는 fontFamily 문자열은 빌드 타임에 해시로 생성된 실제 값이다.
// 예: "'__Gaegu_local_9f8a21', '__Gaegu_local_Fallback_9f8a21'" — 하드코딩된 문자열이 아니다.
const primaryFamily = gaeguLocal.style.fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="next/font/local 커스텀 로컬 폰트 매핑"
        concept="next/font/local은 저장소에 직접 번들링한 .woff2 파일을 weight별로 매핑해 하나의 font-family로 컴파일하고, 빌드 타임에 실제 @font-face 규칙을 생성해 셀프호스팅합니다."
        steps={[
          {
            step: 1,
            title: '[w400], [w700] 굵기 버튼 클릭',
            description: '서로 다른 .woff2 파일(Gaegu-Regular, Gaegu-Bold)이 실제로 매핑된 두 굵기를 전환합니다.',
            actionBadge: '굵기 전환',
          },
          {
            step: 2,
            title: '브라우저 개발자 도구 Network 탭 확인',
            description: '폰트 파일이 외부 도메인이 아니라 이 zone과 같은 도메인(_next/static/media)에서 로드되는지 확인합니다.',
            actionBadge: 'Self-hosting 확인',
          },
          {
            step: 3,
            title: '실제 @font-face 규칙 및 computed style 검증',
            description: 'document.styleSheets에서 실제 @font-face CSSOM 규칙을 읽고, 미리보기 요소의 getComputedStyle 결과가 그 규칙과 일치하는지 확인합니다.',
            actionBadge: '@font-face 실측',
            observe: '3단 검증 패널에서 실제 CSSOM @font-face 규칙과 computed font-family/font-weight 일치 여부 확인',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="next/font/local 커스텀 로컬 폰트 매핑 실습">
        <FontLocalFontFaceDemo
          className={gaeguLocal.className}
          fontFamily={gaeguLocal.style.fontFamily}
          primaryFamily={primaryFamily}
          sources={[
            { path: './assets/fonts/Gaegu-Regular.woff2', weight: '400' },
            { path: './assets/fonts/Gaegu-Bold.woff2', weight: '700' },
          ]}
        />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
