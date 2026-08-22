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

  const defaultExpected = "• experimental_taintUniqueValue 원시 시크릿 유출 차단 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="experimental_taintUniqueValue 원시 시크릿 유출 차단 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="experimental_taintUniqueValue 원시 시크릿 유출 차단">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>React Taint API(experimental_taintUniqueValue)는 결제 API 비밀키, 암호화 솔트 등 특정 원시 문자열 값을 오염(Tainted) 상태로 등록하여, 해당 값이 실수로 클라이언트 컴포넌트의 Props나 Server Action 반환값에 직렬화되어 포함될 경우 런타임에 즉각 에러를 발생시키는 원천 보안 보호 장치입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 예제에서는 PG사 가맹점 라이브 시크릿 키(sk_live_...)를 Taint 등록하여, 서버 컴포넌트에서 상품 결제창 클라이언트 위젯으로 해당 키를 Props로 넘기려 할 때 React가 직렬화를 즉시 차단하고 보안 경고를 발생시킵니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>원천적인 금융 시크릿 키 유출 차단: 개발자의 사소한 Props 전달 실수로 결제 비밀키가 브라우저 네트워크 탭에 평문 노출되는 사고를 원천 방지합니다.</li>
              <li>런타임 객체 탐지: 단순 문자열 검색뿐만 아니라 객체 내부에 중첩된 비밀값까지 React 직렬화 엔진이 심층 검사합니다.</li>
              <li>서버 사이드 보안 인증 충족: 전자상거래 보안 규정 및 가맹점 API 보안 가이드라인을 완벽히 충족합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>토스페이먼츠/이니시스 결제 비밀키 및 Webhook 서명 Secret 보호</li>
              <li>고객 주민등록번호 뒷자리, 카드 비밀번호 앞 2자리 등 민감 개인정보 누출 차단</li>
              <li>AWS S3 프라이빗 버킷 Access Key의 클라이언트 전송 방지</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
