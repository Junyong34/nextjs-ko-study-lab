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

  const defaultExpected = "• 새로고침(Hard Reload) 시 슬롯 복구의 동작과 기대 결과를 확인합니다."
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
        title="새로고침(Hard Reload) 시 슬롯 복구 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="default.tsx를 통한 새로고침(Hard Reload) 시 슬롯 상태 복구">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Parallel Routes 사용 시 브라우저 새로고침(Hard Reload)이 발생하면 Next.js 서버는 이전 클라이언트 탐색 상태를 알 수 없습니다. 이 때 일치하지 않는 모든 병렬 슬롯에 대해 <code>default.tsx</code>를 검색하여 렌더링함으로써 404 에러를 방지하고 화면을 복구합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 사용자가 <code>@sidebar</code> 슬롯에서 특정 필터를 탐색하던 중 브라우저 새로고침을 실행했을 때, 서버가 해당 슬롯의 <code>default.tsx</code>를 즉각 호출하여 기본 필터 요약 UI로 안전하게 초기화 복구하는 메커니즘을 실증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>하드 리로드 404 원천 차단</strong>: 클라이언트 메모리에만 존재하던 슬롯 상태가 새로고침으로 소실되더라도 서버 사이드 렌더링(SSR) 단계에서 404 없이 복구합니다.</li>
              <li><strong>SSR 및 SSG 무결성 유지</strong>: 서버에서 사전 생성되는 HTML에 모든 슬롯의 디폴트 마크업이 누락 없이 채워집니다.</li>
              <li><strong>사용자 탐색 연속성 보장</strong>: 새로고침 후에도 깨지지 않는 완전한 대시보드 레이아웃을 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 다중 탭 검색/필터 패널의 새로고침 시 기본 선택 상태 복원</li>
              <li>관리자 콘솔의 실시간 시스템 로그 및 알림 슬롯 복구</li>
              <li>복합 결제/주문서 화면의 서브 위젯 상태 안정화</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>모든 병렬 슬롯에 default.tsx 배치 권장</strong>: Parallel Routes를 도입할 때는 예상치 못한 새로고침에 대비하여 모든 <code>@slot</code> 폴더 내에 <code>default.tsx</code>를 필수로 생성해야 프로덕션 404 장애를 예방할 수 있습니다.</li>
              <li><strong>Root level default.tsx</strong>: 루트 슬롯뿐 아니라 하위 중첩 슬롯에서도 각 계층에 맞는 <code>default.tsx</code>를 배치해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
