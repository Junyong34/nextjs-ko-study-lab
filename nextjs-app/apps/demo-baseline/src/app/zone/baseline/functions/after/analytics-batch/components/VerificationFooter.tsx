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

  const defaultExpected = "• after() 비동기 데이터 분석 배치 파이프라인 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="after() 비동기 데이터 분석 배치 파이프라인 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="after() 비동기 분석 배치 작업 및 응답 비차단 스케줄링">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>after()</code> (<code>next/server</code>)는 Next.js 15+에서 도입된 표준 수명 주기 함수로, 클라이언트에게 HTTP 응답(Response)을 완전히 스트리밍한 후 백그라운드에서 비동기 작업(분석 로깅, 통계 집계, 알림 발송 등)을 실행하도록 보장합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 주문 요청 시 클라이언트에게 200 OK 응답을 즉각 반환하고, <code>after(async () ={'>'} {'{'} await sendOrderAnalytics(); await syncInventoryDW(); {'}'})</code>를 통해 무거운 데이터 웨어하우스(DW) 배치 전송을 백그라운드에서 안전하게 완료합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>응답 지연(TTFB) 획기적 단축</strong>: 로깅이나 분석 작업 완료를 기다리지 않고 사용자에게 즉시 응답을 내려 체감 속도를 극대화합니다.</li>
              <li><strong>서버리스 런타임 안전 보장</strong>: 일반 <code>Promise</code>와 달리 서버리스 플랫폼이 응답 종료 후 인스턴스를 즉시 프리징(Freeze)하지 않고 <code>after()</code> 태스크가 끝날 때까지 대기합니다.</li>
              <li><strong>실패 격리</strong>: 분석 로깅 도중 발생하는 에러가 사용자의 주문 응답 성공 여부에 영향을 미치지 않습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>주문 결제 성공 후 마케팅 서드파티 픽셀 및 데이터 웨어하우스 비동기 배치 전송</li>
              <li>사용자 행동 감사 로그(Audit Trail) 및 클릭스트림 비동기 적재</li>
              <li>회원가입 후 웰컴 이메일 및 슬랙 알림 백그라운드 발송</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>응답 수정 불가</strong>: <code>after()</code>는 이미 클라이언트에 응답이 전달된 후 실행되므로 쿠키를 쓰거나 응답 본문을 변경할 수 없습니다.</li>
              <li><strong>실행 시간 제한</strong>: 플랫폼의 최대 함수 실행 제한 시간(예: 15초~60초) 내에서 완료되어야 하므로 수 분 이상 걸리는 대규모 작업은 전용 큐(SQS/BullMQ)로 이관해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
