import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ImageComparisonClient } from './components/ImageComparisonClient'

export default function ImageOptimizationDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="next/image 자동 WebP/AVIF 최적화 & Zero CLS 이미지 로딩"
        concept="next/image는 원본 이미지를 브라우저 지원 포맷(WebP/AVIF)으로 자동 압축 변환하고, width/height 종횡비 예약으로 레이아웃 이동(CLS 0)을 방지하며, preload 설정을 통해 LCP 사전 로드를 지원합니다."
        steps={[
          {
            step: 1,
            title: '[1. next/image (WebP/AVIF 자동 변환 + CLS 방지)] 선택 및 확인',
            description: 'next/image가 생성한 최적화 이미지와 고정 종횡비 렌더링, quality 및 preload 파라미터 연동을 확인합니다.',
            actionBadge: 'next/image 최적화',
          },
          {
            step: 2,
            title: '[2. 일반 <img> 태그 (비최적화 원본 로드)] 선택 대조',
            description: '일반 <img> 태그 사용 시 원본 포맷 직접 로드 및 최적화 파이프라인 부재 동작과 대조합니다.',
            actionBadge: '일반 img 대조',
          },
          {
            step: 3,
            title: '[3. 퀄리티 슬라이더 / preload 옵션 조작 및 검증]',
            description: '압축 퀄리티(quality)와 preload 옵션을 변경하며 최적화 파이프라인 쿼리 파라미터 변화를 관찰합니다.',
            actionBadge: '파이프라인 검증',
            observe: 'next/image 적용 시 WebP 자동 변환, 종횡비 예약에 따른 CLS 방지, 그리고 quality/preload 쿼리가 정상 반영됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단, 3단, 4단: 실습 조작 영역 및 검증/개념정리 */}
      <ImageComparisonClient />
    </DemoContainer>
  )
}
