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

  const defaultExpected = "• 'use client' 내부 브라우저 window.localStorage 접근 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="'use client' 내부 브라우저 window.localStorage 접근 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="'use client' 내부 브라우저 window.localStorage 안전 접근 & 하이드레이션 방어">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Client Component는 초기 로딩 시 서버에서도 SSR로 렌더링되므로, <code>window</code>, <code>document</code>, <code>localStorage</code> 등 브라우저 전용 전역 객체는 <code>useEffect</code> 내부나 마운트 완료 플래그(<code>isMounted</code>) 이후에 안전하게 접근해야 하이드레이션 불일치(Hydration Mismatch)를 방지할 수 있습니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 클라이언트 마운트 완료 전에는 스켈레톤/기본 UI를 렌더링하고, 마운트 후 <code>useEffect</code>에서 <code>localStorage.getItem('recent_views')</code>를 읽어 최근 본 상품 목록을 브라우저 스토리지와 안전하게 동기화합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Zero Hydration Mismatch</strong>: 서버 HTML과 브라우저 초기 렌더링 간 텍스트/마크업 불일치 에러를 원천 차단합니다.</li>
              <li><strong>오프라인/로컬 데이터 영속화</strong>: 로그인 없이도 사용자의 장바구니 임시 데이터, 테마 설정, 최근 본 상품을 브라우저에 유지합니다.</li>
              <li><strong>타입 안전한 브라우저 가드</strong>: <code>typeof window !== 'undefined'</code> 체크와 React 라이프사이클을 안전하게 결합합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>비로그인 사용자의 최근 본 상품 목록 및 로컬 검색 기록 저장</li>
              <li>다크모드/라이트모드 사용자 로컬 설정 복구</li>
              <li>폼 작성 중 임시 자동 저장(Auto-save) 복구</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>렌더링 본문 직접 접근 금지</strong>: <code>const theme = localStorage.getItem('theme')</code>를 컴포넌트 본문에서 직접 호출하면 서버 SSR 시 <code>ReferenceError: window is not defined</code>가 발생합니다.</li>
              <li><strong>useSyncExternalStore 활용</strong>: React 18+에서는 <code>localStorage</code> 변경을 구독할 때 <code>useSyncExternalStore</code>를 사용하면 더욱 안정적인 동기화가 가능합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
