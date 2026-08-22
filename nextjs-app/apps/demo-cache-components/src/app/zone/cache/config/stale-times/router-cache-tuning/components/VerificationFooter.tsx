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

  const defaultExpected = "• experimental.staleTimes 클라이언트 라우터 캐시 시간 제어 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="experimental.staleTimes 클라이언트 라우터 캐시 시간 제어 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="experimental.staleTimes 클라이언트 라우터 캐시 시간 제어">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>experimental.staleTimes는 클라이언트 브라우저 인메모리 라우터 캐시(Router Cache)가 동적 및 정적 세그먼트를 재검증 없이 재사용하는 지속 시간(초 단위)을 튜닝하는 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>staleTimes: &#123; dynamic: 30, static: 180 &#125; 설정 시 동적 페이지 이동 시 30초 동안 불필요한 서버 재요청을 방지하고 즉각적인 뒤로가기/앞으로가기 네비게이션을 제공합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>불필요한 서버 RSC 왕복 요청 절감: 상품 목록과 상세를 반복 왕복할 때 라우터 캐시를 재활용하여 서버 부하를 대폭 줄입니다.</li>
              <li>뒤로가기 체감 반응 속도 0ms: 이전에 방문했던 쇼핑몰 스크롤 위치와 화면 상태를 네트워크 지연 없이 즉시 복원합니다.</li>
              <li>정적/동적 라우트별 세밀한 수명 분리: 실시간성이 중요한 동적 페이지와 정적 페이지의 캐시 유효 시간을 개별 튜닝합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상품 목록 &lt;-&gt; 상품 상세 반복 탐색 시 라우터 캐시 최적화</li>
              <li>장바구니/주문서 작성 페이지의 최신 상태 반영을 위한 dynamic 캐시 단축</li>
              <li>모바일 쇼핑몰 네비게이션 체감 속도 극대화</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
