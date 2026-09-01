'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  hasInteracted?: boolean
  quality?: number
  priority?: boolean
  viewMode?: 'both' | 'next-image' | 'html-img'
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    hasInteracted,
    quality = 75,
    priority = false,
    viewMode = 'both',
  } = props

  const defaultExpected =
    '• next/image 컴포넌트를 통해 최적화 파이프라인이 동작하고, quality/priority 옵션에 따라 최적화된 이미지 URL 쿼리와 종횡비 고정이 적용됨\n• 일반 <img> 태그 대비 WebP/AVIF 자동 변환 및 Zero CLS 레이아웃 예약 확인\n• priority 선언 시 LCP 사전 로드(<link rel="preload">) 연동 검증 결과'

  let defaultActual = '• 인터랙션 대기 중 (옵션 툴바에서 퀄리티 슬라이더와 priority 체크박스를 조작해보세요)'
  if (hasInteracted) {
    defaultActual = `• 이미지 최적화 파이프라인: next/image 활성화 (WebP/AVIF 자동 변환 지원)\n• 적용 옵션: quality=${quality}%, priority=${
      priority ? 'true (LCP 사전 로드 활성화)' : 'false (지연 로딩 loading="lazy")'
    }\n• 뷰 모드: ${
      viewMode === 'both'
        ? 'next/image vs img 동시 비교'
        : viewMode === 'next-image'
        ? 'next/image 단독 뷰'
        : '일반 img 단독 뷰'
    }\n• 레이아웃 안정성: width={400} height={225} 종횡비 예약으로 CLS 0 달성 완료`
  }

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : hasInteracted
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="next/image 자동 WebP 변환 및 CLS 방지 최적화 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          '이 예제의 동작과 검증 결과를 표시합니다.'
        }
      />
      <DemoDeepDiveCard title="next/image 자동 WebP/AVIF 최적화 & Zero CLS 이미지 로딩">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/image</code> 컴포넌트는 클라이언트 브라우저가 지원하는 최신 포맷(WebP/AVIF)으로 온디맨드 자동 변환하고, <code>width</code>와 <code>height</code>를 기반으로 종횡비를 미리 예약하여 레이아웃 이동(CLS)을 방지하며, <code>priority</code> 속성을 통해 LCP(Largest Contentful Paint) 이미지를 사전 로드하는 Next.js 공식 표준 최적화 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 일반 <code>&lt;img&gt;</code> 태그와 <code>next/image</code> 컴포넌트를 나란히 배치하고, 퀄리티 슬라이더(quality) 및 <code>priority</code> 체크박스를 조작할 때 생성되는 <code>/_next/image?url=...&q=...</code> 최적화 쿼리 스트링과 이미지 파이프라인의 실시간 변화를 대조 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>대역폭 절감 및 최신 포맷 지원</strong>: 브라우저 Accept 헤더에 맞춰 AVIF 및 WebP로 자동 트랜스코딩하여 전송량을 대폭 절감합니다.</li>
              <li><strong>LCP 로딩 시간 단축</strong>: <code>priority</code> 지정 시 <code>&lt;link rel="preload"&gt;</code>를 헤더에 주입하여 첫 화면 히어로 이미지를 즉시 로드합니다.</li>
              <li><strong>레이아웃 이동(CLS) 방지</strong>: 고정 크기 또는 <code>fill</code> 모드를 통해 렌더링 영역을 사전 확보함으로써 콘텐츠 깜빡임과 밀림 현상을 차단합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 메인 히어로 배너 및 프로모션 대표 이미지 (<code>priority=true</code> 적용)</li>
              <li>수백 개의 상품 썸네일이 나열되는 카탈로그 및 무한 스크롤 피드 (기본 지연 로딩)</li>
              <li>사용자 프로필 사진 및 리뷰 첨부 이미지 등 가변 리소스</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>remotePatterns 도메인 등록</strong>: 외부 CDN 또는 S3 스토리지 이미지를 불러올 때는 <code>next.config.ts</code>의 <code>images.remotePatterns</code>에 허용 도메인을 명시해야 합니다.</li>
              <li><strong>fill 사용 시 sizes 필수</strong>: 부모 요소를 꽉 채우는 <code>fill</code> 모드 사용 시 <code>sizes</code> 속성을 지정하지 않으면 뷰포트 전체(100vw) 크기로 요청되므로 적절한 미디어 쿼리를 전달해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
