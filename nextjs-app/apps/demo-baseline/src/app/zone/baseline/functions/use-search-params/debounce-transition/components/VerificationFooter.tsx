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

  const defaultExpected = "• useTransition 연동 디바운스 검색 쿼리 동기화의 동작과 기대 결과를 확인합니다."
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
        title="useTransition 연동 디바운스 검색 쿼리 동기화 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="useTransition 연동 디바운스 검색 쿼리 동기화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>useSearchParams()</code>와 <code>useTransition</code>을 결합하면 검색어 입력 시 디바운스(Debounce) 타이머를 적용하고, URL 쿼리 변경과 서버 렌더링을 React의 우선순위 트랜지션으로 스케줄링하여 타이핑 끊김을 원천 차단합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 검색창에 키워드를 빠르게 입력할 때 로컬 상태로 인풋 값을 즉시 반영하고, 300ms 디바운스 후 <code>startTransition(() ={'>'} router.replace('?q=...'))</code>을 실행하여 부드러운 URL 동기화와 서버 검색 결과 스트리밍을 수행합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>타이핑 끊김(INP) 제로</strong>: URL 변경과 네트워크 요청을 백그라운드 트랜지션으로 처리하여 사용자 입력 반응성을 100% 보장합니다.</li>
              <li><strong>불필요한 네트워크 요청 90% 절감</strong>: 디바운스를 통해 매 키스트로크마다 발생하는 과도한 서버 쿼리 요청을 방지합니다.</li>
              <li><strong>뒤로가기 스택 오염 방지</strong>: <code>router.replace</code>를 사용하여 중간 검색어 타이핑 기록이 브라우저 히스토리에 쌓이지 않도록 정리합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대규모 이커머스 자동완성 및 상품 실시간 통합 검색바</li>
              <li>관리자 주문 목록의 고객명/전화번호 실시간 라이브 필터링</li>
              <li>지도 기반 매장 위치 검색 및 주소 자동완성 입력창</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>로컬 제어 상태 분리</strong>: URL searchParams를 input의 value로 직접 바인딩하면 디바운스 지연 동안 타이핑이 버벅이므로 로컬 <code>useState</code>와 분리해야 합니다.</li>
              <li><strong>컴포넌트 언마운트 타이머 정리</strong>: <code>useEffect</code> 내 디바운스 구현 시 <code>clearTimeout</code> 반환 함수를 작성하여 메모리 누수를 방지해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
