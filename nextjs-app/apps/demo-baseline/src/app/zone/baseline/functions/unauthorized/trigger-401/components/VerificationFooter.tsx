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

  const defaultExpected = "• unauthorized() 401 인증 필요 트리거의 동작과 기대 결과를 확인합니다."
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
        title="unauthorized() 401 인증 필요 트리거 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="unauthorized() 401 미인증 트리거 및 unauthorized.tsx 연동">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>unauthorized()</code> (<code>next/navigation</code>)는 요청에 유효한 인증 자격 증명(Authentication)이 없을 때 호출되어 <code>NEXT_UNAUTHORIZED</code> 예외를 발생시키고, <code>unauthorized.tsx</code> 컴포넌트를 렌더링하며 HTTP 401 상태 코드를 반환하는 함수입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 세션 쿠키가 없는 익명 사용자가 마이페이지 주문 내역에 접근할 때 <code>unauthorized()</code>를 트리거하여, 로그인 안내 메시지와 함께 로그인 페이지 이동 버튼이 포함된 401 화면을 표시합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>표준 HTTP 401 응답</strong>: REST 및 웹 표준 규격에 맞는 401 Unauthorized 코드를 반환하여 클라이언트 앱 및 웹 뷰와의 연동을 표준화합니다.</li>
              <li><strong>선언적 로그인 유도</strong>: 세션 부재 시 별도의 수동 쿼리 스트링 조작 없이 통일된 401 UI를 제공합니다.</li>
              <li><strong>레이아웃 유지 보존</strong>: GNB 네비게이션을 유지하면서 본문 영역에만 로그인 필요 안내를 안전하게 격리 표시합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>비로그인 사용자의 마이페이지, 위시리스트, 주문서 작성 페이지 접근</li>
              <li>만료된 세션 토큰으로 회원 전용 비공개 커뮤니티 글 열람 시도</li>
              <li>모바일 웹뷰 연동 시 401 상태를 감지하여 네이티브 로그인 팝업 호출</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>try/catch 래핑 금지</strong>: 내부 예외 throw 메커니즘을 방해하지 않도록 <code>try/catch</code> 외부에서 호출해야 합니다.</li>
              <li><strong>returnUrl 처리</strong>: 로그인 후 원래 머물던 페이지로 되돌아올 수 있도록 <code>redirect('/login?returnUrl=...')</code> 방식과 요구사항에 맞춰 적절히 선택해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
