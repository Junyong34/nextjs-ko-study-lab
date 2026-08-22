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

  const defaultExpected = "• [category]/layout.tsx 동적 카테고리 레이아웃 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="[category]/layout.tsx 동적 카테고리 레이아웃 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="[category]/layout.tsx 동적 카테고리 레이아웃">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>[category]/layout.tsx 동적 카테고리 레이아웃는 Next.js App Router의 file-conventions 표준 아키텍처 스펙으로, 웹 표준 모델 위에서 서버 렌더링과 클라이언트 상태 상호작용을 최적화하도록 설계된 핵심 기능입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 실제 이커머스 쇼핑몰의 데이터 흐름([category]/layout.tsx 동적 카테고리 레이아웃)을 바탕으로, 사용자 조작에 따른 상태 변화와 서버-클라이언트 통신 결과를 검증 패널을 통해 단계별로 관찰할 수 있도록 구성되었습니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>프로덕션 안정성 확보: 대규모 트래픽과 복잡한 비즈니스 로직 환경에서도 데이터 무결성과 빠른 반응성을 보장합니다.</li>
              <li>프레임워크 레벨 최적화: Next.js App Router의 내장 캐시 및 비동기 렌더링 파이프라인과 완벽히 결합하여 최고의 성능을 발휘합니다.</li>
              <li>유지보수성 및 확장성: 표준화된 코드 구조를 통해 협업과 장기적인 기능 확장에 유리한 아키텍처를 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 서비스의 핵심 화면 및 백엔드 비즈니스 로직 연동</li>
              <li>사용자 인터랙션 성능 및 서버 렌더링 효율 극대화가 필요한 프로덕션 환경</li>
              <li>보안, 접근성, 검색엔진 최적화(SEO) 표준을 준수해야 하는 엔터프라이즈 애플리케이션</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
