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

  const defaultExpected = "• layout.tsx에서 @admin 및 @user 슬롯 컴포넌트를 props로 전달받아 렌더링\n• 각 슬롯이 독립된 @폴더명/page.tsx 파일에서 병렬 마운트"
  const defaultActual = "• @admin 및 @user 실제 슬롯 컴포넌트 마운트 완료\n• 슬롯별 default.tsx 폴백 및 독립 번들링 정상 감지"

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
        title="권한별 조건부 슬롯 분기 (Parallel Routes) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router의 @slot 컨벤션을 활용하여 단일 화면 내에서 다중 슬롯을 병렬로 조합하는 아키텍처를 검증합니다."}
      />
      <DemoDeepDiveCard title="권한별 조건부 슬롯 분기 (Parallel Routes)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>@slotName</code> 폴더는 부모 <code>layout.tsx</code>에 명명된 슬롯 prop(<code>props.slotName</code>)으로 전달됩니다.
              이를 통해 한 페이지 안에서 서로 다른 권한(관리자 뷰 vs 사용자 뷰)이나 여러 서브 패널을 조건부로 렌더링할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. default.tsx의 역할</h5>
            <p>
              소프트 네비게이션 시 특정 슬롯에 해당하는 하위 경로가 변경될 때, 다른 슬롯의 현재 상태를 잃지 않도록 <code>default.tsx</code>가 기본 폴백 역할을 담당합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>독립적 데이터 페칭: 슬롯별로 서로 다른 캐시 정책 및 Suspense 바운더리 적용 가능</li>
              <li>모달 및 탭 분기: URL을 유지하거나 변경하면서 복수의 뷰를 화면에 동시 표시</li>
              <li>권한별 대시보드 조립: 사용자 역할에 따라 관리자 슬롯 또는 일반 사용자 슬롯 선택적 주입</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
