import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { OgGeneratorClient } from './components/OgGeneratorClient'

export default function OgImageDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="opengraph-image.tsx 동적 소셜 이미지 생성 (ImageResponse & JSX)"
        concept="Next.js의 ImageResponse API는 JSX와 CSS 문법을 활용하여 서버리스 환경에서 1200x630 규격의 동적 소셜 OG 이미지를 실시간 PNG 바이너리로 렌더링합니다."
        steps={[
          {
            step: 1,
            title: '[뱃지 텍스트] 및 [메인 헤드라인] 입력창 수정',
            description: '상단 입력 필드에서 뱃지 문구와 메인 헤드라인 텍스트를 변경합니다.',
            actionBadge: '파라미터 입력',
          },
          {
            step: 2,
            title: '[dark] / [emerald] / [gradient] 테마 배경 버튼 클릭',
            description: '배경 테마 버튼을 클릭하여 OG 캔버스의 스타일 테마를 변경합니다.',
            actionBadge: '테마 변경',
          },
          {
            step: 3,
            title: '1200x630 ImageResponse 캔버스 실시간 갱신 관찰',
            description: 'JSX 및 스타일 기반으로 실시간 렌더링되는 1200x630 Open Graph 이미지 캔버스를 확인합니다.',
            actionBadge: 'OG 캔버스 확인',
            observe: '입력한 뱃지/헤드라인 텍스트 및 선택 테마에 따라 1200x630 OG 캔버스와 ImageResponse 사양(image/png)이 정확히 반영됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) 및 3단/4단 */}
      <DemoPlaygroundCard title="Next.js 16 동적 OpenGraph 이미지 생성 캔버스" className="space-y-4">
        <OgGeneratorClient />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
