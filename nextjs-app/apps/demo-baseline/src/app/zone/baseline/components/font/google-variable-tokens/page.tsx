import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/font/google-variable-tokens')

import React from 'react'
import { Inter, Roboto, Playfair_Display } from 'next/font/google'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FontGoogleVariableDemo } from './components/FontGoogleVariableDemo'
import type { FontMeta } from './types'

// next/font/google — 가변 폰트는 weight를 생략(또는 'variable')하면 Next.js가 빌드 타임에
// Google Fonts 메타데이터에서 그 폰트의 실제 wght 축 최소~최대값을 읽어 하나의 .woff2 파일과
// 범위형 @font-face font-weight 디스크립터(예: 100 900)를 자동 생성한다. weight에 임의의
// 범위 문자열("100 900")을 직접 넘기는 문법은 next/font/local 전용이며, next/font/google에는
// 없다 — 이 zone의 실제 next@16.3.2 타입 선언과 next/dist/compiled/@next/font 소스로
// 교차 검증했다 (공식 문서 Font Module의 weight 설명은 두 로더를 함께 서술해 혼동 소지가 있음).
// variable 옵션은 이 결과를 --font-* CSS 커스텀 프로퍼티로 노출한다. 오프라인이면 셀프호스팅
// 폴백으로 전환된다.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
})

// style.fontFamily는 next/font/google이 반환하는 실제 값이다.
// 예: "'__Inter_9f8a21', '__Inter_Fallback_9f8a21'" — 하드코딩된 문자열이 아니다.
function toPrimaryFamily(fontFamily: string) {
  return fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '')
}

const fonts: FontMeta[] = [
  {
    key: 'inter',
    label: 'Inter',
    className: inter.className,
    variableClassName: inter.variable,
    variableName: '--font-inter',
    fontFamily: inter.style.fontFamily,
    primaryFamily: toPrimaryFamily(inter.style.fontFamily),
    weightRange: { min: 100, max: 900 },
  },
  {
    key: 'roboto',
    label: 'Roboto',
    className: roboto.className,
    variableClassName: roboto.variable,
    variableName: '--font-roboto',
    fontFamily: roboto.style.fontFamily,
    primaryFamily: toPrimaryFamily(roboto.style.fontFamily),
    weightRange: { min: 100, max: 900 },
  },
  {
    key: 'playfair-display',
    label: 'Playfair Display',
    className: playfairDisplay.className,
    variableClassName: playfairDisplay.variable,
    variableName: '--font-playfair-display',
    fontFamily: playfairDisplay.style.fontFamily,
    primaryFamily: toPrimaryFamily(playfairDisplay.style.fontFamily),
    weightRange: { min: 400, max: 900 },
  },
]

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="next/font/google 가변 폰트 및 CSS 변수 토큰"
        concept="next/font/google으로 가변 폰트를 weight 없이 호출하면 그 폰트의 전체 wght 축을 담은 .woff2 파일 하나와 범위형 @font-face가 자동 생성되고, variable 옵션이 그 결과를 --font-* CSS 변수로 노출합니다."
        steps={[
          {
            step: 1,
            title: '[Inter], [Roboto], [Playfair Display] 폰트 선택',
            description: '실제 next/font/google 인스턴스 3개를 전환합니다. 폰트마다 실제 wght 축 범위(100~900 또는 400~900)가 다릅니다.',
            actionBadge: '폰트 선택',
          },
          {
            step: 2,
            title: '굵기(wght) 슬라이더를 끝까지 움직이기',
            description: '슬라이더가 100→900처럼 넓은 범위를 움직여도 Network 탭에는 폰트 파일 요청이 추가되지 않는지 확인합니다.',
            actionBadge: '실시간 보간',
          },
          {
            step: 3,
            title: 'CSS 변수와 @font-face 범위 실측 검증',
            description: 'document.styleSheets에서 실제 @font-face font-weight 범위를, getComputedStyle에서 실제 --font-* 변수 값과 적용된 굵기를 읽어 대조합니다.',
            actionBadge: 'CSS 변수 실측',
            observe: '3단 검증 패널에서 CSS 변수 노출 여부와 computed font-weight 일치 확인',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="Google Fonts 가변 폰트 CSS 변수 연동 실습">
        <FontGoogleVariableDemo fonts={fonts} />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
