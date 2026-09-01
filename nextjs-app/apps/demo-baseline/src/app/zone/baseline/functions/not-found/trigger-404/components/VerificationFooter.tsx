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

  const defaultExpected = "• notFound() 404 트리거 및 not-found.tsx 렌더의 동작과 기대 결과를 확인합니다."
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
        title="notFound() 404 트리거 및 not-found.tsx 렌더 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="notFound() 프로그래밍 방식 404 페이지 트리거">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>notFound()</code> (<code>next/navigation</code>)는 서버 컴포넌트, Route Handler, Server Action에서 호출되어 <code>NEXT_NOT_FOUND</code> 내부 예외를 발생시키고, 가장 가까운 <code>not-found.tsx</code> 바운더리 컴포넌트를 렌더링하며 HTTP 404 상태 코드를 반환하는 함수입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 데이터베이스 조회 결과 상품(<code>id: 'invalid-999'</code>)이 존재하지 않을 때 <code>notFound()</code>를 호출하여, 상위 레이아웃을 유지한 채 본문 영역을 커스텀 404 안내 화면으로 즉각 전환하고 404 상태를 기록합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>정확한 HTTP 404 반환</strong>: 클라이언트 라우팅에서도 검색엔진 크롤러에게 올바른 404 Not Found 상태 코드를 명확히 전달하여 잘못된 색인을 방지합니다.</li>
              <li><strong>중첩 세그먼트 지원</strong>: 하위 라우트 세그먼트에 정의된 전용 <code>not-found.tsx</code>를 우선 매칭하여 맥락에 맞는 친절한 안내를 제공합니다.</li>
              <li><strong>조기 반환(Early Return)</strong>: 복잡한 조건문 중첩 없이 데이터 미존재 시점에 즉시 렌더링 파이프라인을 중단합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>존재하지 않거나 삭제/단종된 상품 상세 페이지(<code>/products/[id]</code>) 접근 시</li>
              <li>비공개 또는 유효기간이 지난 이벤트 프로모션 페이지 접근 시</li>
              <li>잘못된 사용자 프로필 핸들(<code>/users/[handle]</code>) 접근 시</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>try/catch 블록 내 호출 금지</strong>: <code>notFound()</code>는 내부적으로 특수 예외를 throw하므로 <code>try/catch</code> 블록으로 감싸면 예외가 잡혀 404 화면이 뜨지 않고 일반 에러로 처리됩니다.</li>
              <li><strong>반환값 불필요</strong>: <code>notFound()</code>는 <code>never</code> 타입을 반환하므로 <code>return notFound()</code> 대신 <code>notFound()</code>로 단독 호출합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
