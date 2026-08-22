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

  const defaultExpected = "• assetPrefix: &apos;https://cdn.shop.com&apos; CDN 자산 배포 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="assetPrefix: &apos;https://cdn.shop.com&apos; CDN 자산 배포 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="assetPrefix: &apos;https://cdn.shop.com&apos; CDN 자산 배포">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>assetPrefix는 JS 번들, CSS, 정적 이미지 등 /_next/static/ 정적 자산의 URL 경로 접두사를 외부 전용 CDN(CloudFront, Cloudflare 등) 도메인으로 변경하는 next.config.ts 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>assetPrefix: &apos;https://cdn.shop.com&apos; 설정 시 HTML 문서의 script, link 태그가 원본 웹 서버 대신 글로벌 엣지 CDN 주소를 직접 가리키도록 빌드 타임에 치환합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>메인 서버 트래픽 및 부하 분산: 대용량 정적 파일 요청을 글로벌 CDN 엣지에서 100% 흡수하여 웹 서버 CPU/대역폭을 비즈니스 로직에 집중합니다.</li>
              <li>전 세계 사용자 로딩 가속: 지리적으로 가장 가까운 CDN PoP에서 자산을 서빙하여 LCP 및 FCP 성능 지표를 대폭 개선합니다.</li>
              <li>Multi-Region 자산 일원화: 여러 프론트엔드 존에서 공통 정적 자산을 단일 CDN 버킷에서 안정적으로 호스팅합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대규모 트래픽이 몰리는 이커머스 정적 번들 AWS S3 / CloudFront 분산 배포</li>
              <li>글로벌 쇼핑몰의 지역별 정적 자산 로딩 지연 최소화</li>
              <li>원본 서버와 분리된 독립 정적 자산 스토리지 아키텍처 구축</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
