import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ImageComparisonClient } from './components/ImageComparisonClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function ImageOptimizationDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="next/image 자동 WebP 변환 & CLS 방지 최적화"
        concept="Next.js의 <Image> 컴포넌트는 브라우저 지원 여부에 맞춰 최신 WebP/AVIF 포맷으로 자동 변환하고, 기기 해상도별 반응형 크기 서빙 및 로딩 중 레이아웃 흔들림(CLS)을 완벽하게 차단합니다."
        steps={[
          {
            step: 1,
            title: 'HTML <img> vs Next.js <Image> 대조',
            description: '일반 <img>와 Next.js <Image>의 내부 포맷 변환 및 레이아웃 안정성 차이를 확인합니다.',
            actionBadge: 'WebP 자동 변환',
          },
          {
            step: 2,
            title: '압축 퀄리티 조절 (30% ~ 100%)',
            description: '상단 슬라이더를 조작하여 이미지 압축률에 따른 대역폭 최적화 옵션을 실습합니다.',
            actionBadge: '품질 제어',
          },
          {
            step: 3,
            title: 'priority(LCP 최우선 로드) 옵션 테스트',
            description: '첫 화면 Hero 이미지에 priority를 주어 뷰포트 지연 로딩을 건너뛰고 즉시 로드하는 기법을 학습합니다.',
            actionBadge: 'LCP 최적화',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="Next.js 이미지 최적화 파이프라인 시뮬레이터" className="space-y-4">
        <ImageComparisonClient />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
