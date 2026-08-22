import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { OgGeneratorClient } from './components/OgGeneratorClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function OgImageDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="opengraph-image.tsx 동적 OG 이미지 생성 (ImageResponse)"
        concept="Next.js는 opengraph-image.tsx 특수 파일 규칙과 ImageResponse API를 통해, 외부 그래픽 도구 없이도 JSX와 CSS를 서버에서 1200x630 해상도의 고화질 OpenGraph PNG 이미지로 실시간 생성하여 배포합니다."
        steps={[
          {
            step: 1,
            title: '뱃지 문구 및 헤드라인 수정',
            description: '상단 폼에서 텍스트를 수정하여 OG 캔버스 뷰어가 실시간 반응하는 것을 봅니다.',
            actionBadge: 'JSX 컴포넌트 렌더',
          },
          {
            step: 2,
            title: '배경 테마 변경 (Dark / Emerald / Gradient)',
            description: '테마 버튼을 눌러 CSS 색상 팔레트와 그라디언트가 적용되는 것을 확인합니다.',
            actionBadge: 'Flexbox 스타일링',
          },
          {
            step: 3,
            title: 'ImageResponse 아키텍처 학습',
            description: '하단 개념 정리 카드에서 Satori + Resvg 기반의 초고속 이미지 래스터라이징 원리를 학습합니다.',
            actionBadge: 'Satori 엔진 원리',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="Next.js 16 동적 OpenGraph 이미지 생성 캔버스" className="space-y-4">
        <OgGeneratorClient />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
