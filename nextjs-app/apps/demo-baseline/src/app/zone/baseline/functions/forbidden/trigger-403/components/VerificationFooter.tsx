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

  const defaultExpected = "• forbidden() 403 인가 거부 트리거의 동작과 기대 결과를 확인합니다."
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
        title="forbidden() 403 인가 거부 트리거 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="forbidden() 403 권한 거부 트리거 및 forbidden.tsx 연동">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>forbidden()</code> (<code>next/navigation</code>)은 인증은 되었으나 특정 리소스에 대한 접근 권한(Authorization)이 부족할 때 호출되어 <code>NEXT_FORBIDDEN</code> 예외를 던지고, 가장 가까운 <code>forbidden.tsx</code> 파일 컨벤션을 렌더링하며 HTTP 403 상태를 반환하는 함수입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 일반 사용자 세션으로 파트너 정산 관리자 대시보드 접근을 시도할 때, 서버 컴포넌트에서 사용자 역할을 검사하여 <code>forbidden()</code>을 호출하고 관리자 권한 필요 403 화면으로 전환합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>401(미인증)과 403(인가실패)의 명확한 분리</strong>: 로그인되지 않은 상태와 권한이 부족한 상태를 명확히 구별하여 정확한 HTTP 상태를 제공합니다.</li>
              <li><strong>보안 감사 로깅 연동</strong>: 비인가 접근 시도를 서버 단에서 감지하여 보안 관제 로그에 즉시 기록할 수 있습니다.</li>
              <li><strong>선언적 권한 제어</strong>: 복잡한 리다이렉트 분기 없이 권한 부족 시점에 한 줄로 접근을 차단합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>일반 회원의 판매자/관리자 전용 대시보드(<code>/admin/settlement</code>) 접근 차단</li>
              <li>타인의 주문 상세 내역이나 비공개 결제 영수증 조회 시도 차단</li>
              <li>특정 구독 플랜(Enterprise) 전용 기능에 Standard 사용자가 접근할 때</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>try/catch 래핑 금지</strong>: <code>forbidden()</code> 역시 Next.js 내부 제어 예외를 던지므로 <code>try/catch</code>로 가로채지 않아야 정상 작동합니다.</li>
              <li><strong>forbidden.tsx 파일 구비</strong>: 해당 세그먼트 또는 상위에 <code>forbidden.tsx</code> 파일이 정의되어 있어야 커스텀 권한 부족 UI가 렌더링됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
