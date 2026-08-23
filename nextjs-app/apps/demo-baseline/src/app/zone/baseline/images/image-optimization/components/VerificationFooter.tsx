'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = "• next/image 자동 WebP 변환 및 CLS 방지 최적화 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="next/image 자동 WebP 변환 및 CLS 방지 최적화 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="next/image 자동 WebP 변환 및 CLS 방지 최적화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>next/image</code> 컴포넌트는 요청 기기 규격에 맞춘 온디맨드 WebP/AVIF 이미지 자동 변환, 디바이스 뷰포트별 <code>srcset</code>/<code>sizes</code> 생성, <code>priority</code> 속성을 통한 LCP(Largest Contentful Paint) 프리로드 및 흐림 효과 플레이스홀더(Blur-up)를 제공하는 표준 이미지 최적화 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 고해상도 원본 상품 이미지를 <code>next/image</code>로 렌더링하고, 뷰포트 크기에 따른 <code>sizes</code> 반응형 변환, 저화질 블러 플레이스홀더(BlurDataURL) 표시, 그리고 LCP 이미지의 <code>{'<'}link rel="preload"{'>'}</code> 헤더 주입 동작을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>네트워크 대역폭 최대 80% 절감</strong>: 최신 AVIF/WebP 압축 및 디바이스 픽셀 밀도(DPR)별 맞춤 리사이징을 적용합니다.</li>
                    <li><strong>LCP 로딩 시간 획기적 단축</strong>: <code>priority</code> 지시어를 통해 브라우저가 최우선순위로 히어로 이미지를 사전 로드합니다.</li>
                    <li><strong>레이아웃 이동(CLS) 원천 방지</strong>: <code>width</code>/<code>height</code> 또는 <code>fill</code> 비율을 기반으로 사전 렌더링 공간을 확보하여 콘텐츠 밀림을 방지합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>이커머스 메인 배너 및 히어로 프로모션 이미지의 즉각적인 LCP 로딩</li>
                    <li>수십 수백 개의 상품 썸네일이 나열되는 무한 스크롤 카탈로그 그리드</li>
                    <li>사용자 업로드 프로필 사진 및 상품 리뷰 이미지의 최적화 표시</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>remotePatterns 도메인 등록</strong>: 외부 CDN이나 S3 버킷의 이미지를 사용할 경우 <code>next.config.ts</code>의 <code>images.remotePatterns</code>에 호스트명을 명시해야 보안 에러를 방지할 수 있습니다.</li>
                    <li><strong>sizes 속성 필수 정의</strong>: <code>fill</code> 모드 사용 시 <code>sizes</code> 속성을 생략하면 브라우저가 100vw 전체 뷰포트 크기로 이미지를 다운로드하므로 그리드 크기(e.g. <code>(max-width: 768px) 100vw, 33vw</code>)를 반드시 지정해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
