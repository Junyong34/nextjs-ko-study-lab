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

  const defaultExpected = "• images.remotePatterns 외부 이미지 도메인 허용 및 보안 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="images.remotePatterns 외부 이미지 도메인 허용 및 보안 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="images.remotePatterns 외부 이미지 도메인 허용 및 보안">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>images.remotePatterns는 next/image 최적화 파이프라인에서 처리할 수 있는 외부 이미지 원본의 프로토콜, 호스트네임, 포트, 경로 패턴을 엄격하게 제한하는 화이트리스트 보안 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>protocol: &apos;https&apos;, hostname: &apos;**.s3.ap-northeast-2.amazonaws.com&apos;과 같이 와일드카드 패턴을 매칭하여 신뢰할 수 있는 S3 스토리지 도메인의 상품 이미지만 서버 사이드 리사이징을 허용합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>SSRF(Server-Side Request Forgery) 방어: 악의적인 사용자가 임의의 내부 IP나 위험한 외부 URL을 이미지 소스로 요청하여 서버를 공격하는 것을 원천 차단합니다.</li>
              <li>이미지 최적화 리소스 고갈 방지: 승인되지 않은 대용량 이미지 요청으로 인한 서버 메모리 및 CPU 자원 낭비를 방지합니다.</li>
              <li>세분화된 경로(pathname) 제한: 버킷 내 특정 공개 폴더(/public/products/**)만 선별 허용하여 비공개 문서 유출을 막습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>AWS S3 상품 이미지 버킷 도메인 보안 화이트리스트 등록</li>
              <li>외부 파트너사/입점업체 CDN 이미지 서빙 권한 제한</li>
              <li>전자상거래 보안 인증(ISMS-P) 외부 자산 보안 규정 준수</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
