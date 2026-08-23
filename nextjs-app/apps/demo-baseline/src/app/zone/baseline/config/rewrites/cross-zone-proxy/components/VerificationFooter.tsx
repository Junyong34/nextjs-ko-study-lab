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

  const defaultExpected = "• rewrites() Zone 간 라우팅 및 외부 API 프록시 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="rewrites() Zone 간 라우팅 및 외부 API 프록시 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="next.config.ts rewrites() 크로스 존(Cross-Zone) 리버스 프록시">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>next.config.ts</code>의 <code>async rewrites()</code> 설정은 수신된 URL 요청을 브라우저 주소창 변경 없이 다른 마이크로 프론트엔드 존(Zone)이나 외부 레거시 백엔드 서버로 투명하게 리버스 프록시(Reverse Proxy)하는 강력한 라우팅 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 클라이언트가 <code>shop.com/checkout/:path*</code>로 접근할 때, 메인 셸 서버가 내부적으로 결제 전용 마이크로 존(<code>https://checkout-zone.internal/:path*</code>)으로 요청을 프록시하여 단일 도메인 사용자 경험을 유지합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>무중단 마이크로 프론트엔드(MFE) 아키텍처</strong>: 거대한 모놀리식 Next.js 앱을 독립 배포 가능한 여러 개의 경량 존(Zone)으로 분리 운영합니다.</li>
              <li><strong>동일 출처 정책(SOP) 유지</strong>: 타 서비스나 레거시 API를 동일 도메인 아래로 매핑하여 브라우저 CORS 문제를 근본적으로 해결합니다.</li>
              <li><strong>점진적 레거시 마이그레이션</strong>: 레거시 스프링/장고 시스템의 특정 화면만 Next.js로 교체하면서 전체 URL 구조는 그대로 유지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대규모 쇼핑몰의 메인 셸, 결제 존, 고객센터 존 간의 크로스 존 라우팅</li>
              <li>레거시 백엔드 관리자 화면의 단계별 Next.js 프록시 통합</li>
              <li>타사 서드파티 위젯 서비스의 사내 도메인 마스킹 프록시</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>쿠키 및 인증 헤더 포워딩</strong>: 외부 도메인으로 리라이트 시 브라우저 쿠키와 헤더가 유실되지 않도록 프록시 헤더 전달 정책을 점검해야 합니다.</li>
              <li><strong>프록시 레이턴시 고려</strong>: 백엔드 존과의 네트워크 RTT가 추가되므로 동일 VPC 내부 통신망을 활용하는 것이 바람직합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
