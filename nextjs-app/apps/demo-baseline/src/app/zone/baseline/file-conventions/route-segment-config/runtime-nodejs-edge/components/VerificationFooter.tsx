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

  const defaultExpected = "• nodejs vs edge 런타임 대조 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="nodejs vs edge 런타임 대조 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="nodejs vs edge 런타임 대조">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>export const runtime = &apos;nodejs&apos; | &apos;edge&apos;는 해당 라우트 세그먼트의 실행 엔진을 완전한 Node.js 풀스택 환경 또는 전 세계 분산 Edge V8 런타임 중 선택하는 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>저지연 지리적 분산이 필요한 API는 edge로 콜드스타트 0ms 실행하고, 파일 I/O나 Node.js 모듈(fs, crypto)이 필요한 주문 정산은 nodejs로 분기 처리합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌 사용자 최저 지연시간(Edge): 전 세계 300+ 엣지 로케이션에서 사용자에게 가장 가까운 위치에서 즉시 응답합니다.</li>
              <li>풀 Node.js 네이티브 생태계 지원(Node.js): 모든 npm 네이티브 C++ 바인딩, DB ORM(Prisma, TypeORM) 및 파일 시스템 API를 제한 없이 활용합니다.</li>
              <li>인프라 비용 및 리소스 최적화: 초경량 엣지 컴퓨팅과 고성능 서버 컴퓨팅을 라우트 단위로 정밀하게 하이브리드 구성합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>GeoIP 기반 로케일 리다이렉트 및 A/B 테스트 미들웨어/라우트 (Edge)</li>
              <li>글로벌 환율 변환 및 실시간 단순 재고 확인 API (Edge)</li>
              <li>결제 승인, DB 트랜잭션 및 복잡한 세무 계산 백엔드 API (Node.js)</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
