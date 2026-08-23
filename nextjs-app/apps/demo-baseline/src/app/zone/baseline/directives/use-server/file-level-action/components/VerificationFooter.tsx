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

  const defaultExpected = "• 파일 레벨 'use server' Server Action 모듈 분리 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="파일 레벨 'use server' Server Action 모듈 분리 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="파일 레벨 'use server' Server Action 모듈 분리 및 클라이언트 호출">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>파일 최상단에 <code>'use server'</code>를 선언하면 해당 파일에서 내보내는(export) 모든 비동기 함수가 보안 HTTP POST 엔드포인트를 가진 독립 Server Action으로 등록됩니다. Client Component 및 Server Component 어디서든 직접 임포트하여 호출할 수 있습니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>actions/cart.ts</code>에 파일 레벨 <code>'use server'</code>로 정의된 <code>addToCartAction(productId, quantity)</code>을 클라이언트 버튼 컴포넌트에서 일반 함수처럼 임포트하여 호출하고, 서버 DB 처리 후 반환된 결과를 실시간 UI에 반영합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>API 라우트 보일러플레이트 제거</strong>: 별도의 <code>route.ts</code> 파일과 수동 <code>fetch('/api/cart', {'{'} method: 'POST' {'}'})</code> 작성 없이 타입 안전한 RPC 방식으로 서버 코드를 호출합니다.</li>
              <li><strong>클라이언트 번들 격리</strong>: 액션 내부의 DB 접근 코드, ORM, 비밀키가 클라이언트 JS 번들에 단 1바이트도 포함되지 않습니다.</li>
              <li><strong>재사용성 극대화</strong>: 여러 클라이언트 컴포넌트에서 동일한 Server Action 함수를 손쉽게 임포트하여 공유합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>장바구니 상품 추가/삭제 및 수량 변경 액션</li>
              <li>사용자 회원가입, 로그인 및 비밀번호 재설정 폼 제출</li>
              <li>결제 승인 요청 및 환불 처리 트랜잭션</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>공개 엔드포인트 노출 인식</strong>: <code>'use server'</code> 함수는 내부적으로 공개 HTTP POST URL을 가지므로 누구나 호출할 수 있습니다. 반드시 액션 내부에서 사용자 인증 및 권한 검사(Authorization)를 철저히 수행해야 합니다.</li>
              <li><strong>직렬화 가능한 인수 전달</strong>: Server Action의 인수와 반환값은 React Server Actions 직렬화 규격을 준수해야 하므로 함수나 클래스 인스턴스는 전달할 수 없습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
