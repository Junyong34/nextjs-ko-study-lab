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

  const defaultExpected = "• cookies().delete() 세션 파기 및 로그아웃의 동작과 기대 결과를 확인합니다."
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
        title="cookies().delete() 세션 파기 및 로그아웃 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="cookies().delete() 로그아웃 및 세션 무효화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>(await cookies()).delete('session_id')</code>는 지정된 이름의 쿠키를 즉시 만료(<code>Max-Age=0</code>)시키는 응답 헤더(<code>Set-Cookie</code>)를 발행하여 클라이언트 브라우저에서 쿠키를 안전하게 파기하는 서버 메서드입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 [로그아웃] 버튼 클릭 시 실행되는 Server Action에서 세션 쿠키를 삭제하고, <code>redirect('/login')</code>과 연동하여 인증 상태를 초기화하고 로그인 페이지로 안전하게 이동시킵니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>완벽한 클라이언트 세션 파기</strong>: 브라우저 스토리지 잔재 없이 <code>Set-Cookie</code> 헤더를 통해 쿠키를 완전히 제거합니다.</li>
              <li><strong>도메인/경로 스코프 일괄 정리</strong>: 특정 <code>path</code>나 <code>domain</code>에 종속된 쿠키도 옵션을 명시하여 정확하게 삭제합니다.</li>
              <li><strong>원자적 로그아웃 플로우</strong>: 쿠키 삭제와 페이지 리다이렉트를 단일 Server Action 내에서 원자적으로 실행합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>회원 서비스 로그아웃 시 인증 토큰 및 리프레시 토큰 즉시 파기</li>
              <li>결제 완료 또는 주문 취소 시 임시 결제 세션 쿠키 제거</li>
              <li>팝업 [오늘 하루 보지 않기] 설정 만료 시 쿠키 정리</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>path/domain 불일치 주의</strong>: 쿠키 생성 시 <code>path: '/'</code>를 지정했다면 <code>delete()</code> 호출 시에도 동일한 <code>path: '/'</code> 옵션을 지정해야 브라우저에서 정상 파기됩니다.</li>
              <li><strong>서버 세션 저장소 동기화</strong>: 쿠키 삭제뿐만 아니라 Redis 등 서버 세션 스토어의 토큰도 함께 블랙리스트 처리해야 완벽한 로그아웃이 완성됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
