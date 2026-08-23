import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ImageComparisonClient } from './components/ImageComparisonClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function ImageOptimizationDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="next/image 자동 WebP/AVIF 최적화 & Zero CLS 이미지 로딩"
        concept="next/image는 원본 고화질 이미지(1.8MB)를 브라우저 지원 포맷(WebP/AVIF 142KB)으로 자동 압축 변환(약 92% 절감)하고, width/height 종횡비 예약으로 레이아웃 이동(CLS 0)을 완벽 방지합니다."
        steps={[
          {
            step: 1,
            title: '[1. next/image (WebP/AVIF 자동 변환 + CLS 방지)] 선택',
            description: 'next/image가 생성한 142KB WebP 최적화 이미지와 고정 종횡비 렌더링을 확인합니다.',
            actionBadge: 'next/image 최적화',
          },
          {
            step: 2,
            title: '[2. 일반 <img> 태그 (원본 PNG/JPEG 대용량 로드)] 선택 대조',
            description: '일반 <img> 태그 선택 시 1.8MB 원본 로드 지연과 이미지 로드 전 레이아웃 흔들림(CLS 발생) 동작과 대조합니다.',
            actionBadge: '일반 img 대조',
          },
          {
            step: 3,
            title: '네트워크 페이로드 & CLS 수치 관찰',
            description: '용량 절감률(92%↓) 및 Core Web Vitals CLS(0.00 vs 0.35) 성능 지표 대조 결과를 관찰합니다.',
            actionBadge: '성능 지표 대조',
            observe: 'next/image 적용 시 1.8MB 원본이 142KB WebP로 92% 압축되고 CLS가 0.00으로 유지됨',
            observeAt: 'playground',
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
