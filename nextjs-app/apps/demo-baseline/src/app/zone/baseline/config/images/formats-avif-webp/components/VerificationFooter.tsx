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

  const defaultExpected = "• images.formats: ['image/avif', 'image/webp'] 차세대 포맷의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="images.formats: ['image/avif', 'image/webp'] 차세대 포맷 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="next.config.ts images.formats 차세대 이미지 포맷 최적화 (AVIF & WebP)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>images.formats: ['image/avif', 'image/webp']</code> (<code>next.config.ts</code>) 설정은 <code>next/image</code> 최적화 파이프라인이 원본 이미지를 최신 고압축 포맷인 AVIF와 WebP로 자동 변환하도록 지정하는 옵션입니다. 브라우저의 <code>Accept</code> 헤더를 검사하여 최적 포맷을 협상 서빙합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 대용량 JPEG 상품 화보 이미지가 <code>next/image</code>를 거치며 AVIF를 지원하는 모던 브라우저에는 용량이 최대 70% 감소된 AVIF로, 미지원 브라우저에는 WebP로 자동 다운샘플링되어 서빙되는 파이프라인을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>이미지 페이로드 50~70% 획기적 절감</strong>: 동일 화질 기준 JPEG 대비 WebP는 약 30%, AVIF는 약 50~70% 파일 크기를 줄여 네트워크 비용을 대폭 절감합니다.</li>
              <li><strong>LCP(Largest Contentful Paint) 성능 향상</strong>: 히어로 배너 이미지 다운로드 시간을 단축하여 Core Web Vitals 점수를 극대화합니다.</li>
              <li><strong>브라우저 자동 협상(Content Negotiation)</strong>: 브라우저 호환성을 개발자가 신경 쓸 필요 없이 인프라가 자동으로 최적 포맷을 선택합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>고해상도 패션/명품 룩북 및 상품 상세 화보 이미지 서빙</li>
              <li>쇼핑몰 메인 홈 대형 프로모션 히어로 캐러셀 배너 최적화</li>
              <li>모바일 데이터 통신 환경에서의 대규모 상품 썸네일 그리드 로딩 가속</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>AVIF 변환 CPU 연산 비용</strong>: AVIF는 압축률이 뛰어난 대신 첫 온디맨드 변환 시 WebP보다 CPU 연산 시간이 더 소요되므로 배포 전 이미지 최적화 캐시 워밍 또는 CDN 캐시를 적극 활용해야 합니다.</li>
              <li><strong>배열 순서 중요성</strong>: <code>['image/avif', 'image/webp']</code> 순서로 작성해야 브라우저가 지원할 때 더 효율적인 AVIF가 우선 선택됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
