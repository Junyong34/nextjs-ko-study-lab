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

  const defaultExpected = '• 버튼 클릭에 따른 장바구니 수량 상태 변화를 확인합니다.'
  const defaultActual = '• 버튼 클릭 후 장바구니 수량을 표시합니다.'

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
        title="장바구니 수량 상태 변경 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || '이 화면은 updateTag()가 아닌 클라이언트 상태 변경을 보여줍니다.'}
      />
                        <DemoDeepDiveCard title="updateTag()와 클라이언트 상태 변경의 차이">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>updateTag(tag)</code>는 Server Action에서 지정한 태그의 캐시를 즉시 만료시키는 API입니다. 이 데모 화면은 해당 API를 호출하지 않고, 클라이언트의 <code>useState</code>로 장바구니 수량을 변경합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>버튼을 누르면 <code>useState</code>가 수량을 1 늘리고, 변경된 값이 같은 컴포넌트에 다시 렌더링됩니다. 서버 캐시를 무효화하거나 서버 데이터를 다시 읽는 과정은 이 화면에 포함하지 않습니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 이 예제에서 확인할 점</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>버튼 클릭과 상태 변경의 관계</li>
                    <li>네트워크 요청 없이 화면을 다시 렌더링하는 흐름</li>
                    <li>클라이언트 상태와 서버 캐시 무효화의 차이</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>버튼·입력 필드 같은 클라이언트 상호작용 확인</li>
                    <li>서버 요청 전후의 UI 상태 변화를 비교하는 예제</li>
                    <li>실제 <code>updateTag()</code> 구현 전에 상태 변경 흐름을 확인하는 화면</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>API 호출 여부 확인</strong>: 서버 캐시를 만료하려면 Server Action에서 실제로 <code>updateTag()</code>를 호출해야 합니다.</li>
                    <li><strong>상태의 범위 구분</strong>: <code>useState</code>로 바꾼 값은 이 컴포넌트의 상태이며 서버 캐시나 데이터베이스를 변경하지 않습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
