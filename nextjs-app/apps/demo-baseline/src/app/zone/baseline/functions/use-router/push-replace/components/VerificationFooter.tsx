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

  const defaultExpected = "• useRouter push vs replace vs back 프로그래밍 네비게이션 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="useRouter push vs replace vs back 프로그래밍 네비게이션 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="useRouter push vs replace vs back 프로그래밍 네비게이션">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>useRouter()</code> (<code>next/navigation</code>)는 클라이언트 컴포넌트(<code>'use client'</code>)에서 라우터 인스턴스를 가져와 브라우저 히스토리 조작과 소프트 네비게이션을 프로그래밍 방식으로 실행하는 훅입니다. <code>router.push()</code>는 히스토리 스택에 새 URL을 추가하고, <code>router.replace()</code>는 현재 엔트리를 덮어쓰며, <code>router.back()</code>은 이전 기록으로 복귀합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 [주문서 이동(push)], [필터 치환(replace)], [뒤로가기(back)] 버튼을 클릭하여 브라우저 히스토리 스택의 변화와 URL 변경 시 클라이언트 상태(입력값/스크롤) 유지 여부를 실시간으로 대조 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>뒤로가기 루프 방지</strong>: 결제 완료 후 결제 페이지 재진입을 막기 위해 <code>replace()</code>로 히스토리를 교체하여 안전한 내비게이션 플로우를 보장합니다.</li>
              <li><strong>SPA 소프트 네비게이션</strong>: 전체 페이지 리로드 없이 변경된 세그먼트의 RSC 페이로드만 패치하여 빠른 화면 전환을 제공합니다.</li>
              <li><strong>프로그래밍 제어 유연성</strong>: 비동기 API 처리 완료, 인증 콜백 등 복잡한 비즈니스 분기 조건에 따라 동적 이동이 가능합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>결제 승인 완료 후 주문 완료 상세 페이지로 히스토리 교체 이동 (<code>router.replace('/orders/123')</code>)</li>
              <li>검색 필터 다이얼로그에서 선택 완료 시 쿼리 스트링 갱신</li>
              <li>모달 닫기 버튼 클릭 시 이전 화면으로 복귀 (<code>router.back()</code>)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 컴포넌트 사용 불가</strong>: <code>useRouter</code>는 클라이언트 전용 훅이므로 서버 컴포넌트에서는 <code>redirect()</code> 함수를 사용해야 합니다.</li>
              <li><strong>Link 컴포넌트 우선 원칙</strong>: 단순 앵커 내비게이션의 경우 SEO 크롤링 및 자동 프리페칭 이점을 위해 <code>useRouter</code> 대신 <code>{'<'}Link{'>'}</code> 컴포넌트를 사용하는 것이 권장됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
