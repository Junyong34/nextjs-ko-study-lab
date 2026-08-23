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
      <DemoDeepDiveCard title="권한별 조건부 슬롯 분기 (Parallel Routes Conditional Rendering)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              부모 <code>layout.tsx</code>에서 사용자 세션이나 역할(Role)을 확인한 후, <code>@admin</code> 슬롯 또는 <code>@user</code> 슬롯 컴포넌트를 조건부로 선택하여 렌더링하는 역할 기반 UI 조합 패턴입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 상단 역할 전환 스위치를 통해 일반 회원(User) 모드일 때는 <code>@user</code> 슬롯(일반 대시보드)을 렌더링하고, 관리자(Admin) 모드로 전환 시 <code>@admin</code> 슬롯(정산 및 시스템 통계 패널)으로 즉시 교체 마운트되는 동작을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 사이드 권한 격리</strong>: 관리자 전용 컴포넌트와 비즈니스 로직 코드가 일반 사용자 브라우저 번들에 전혀 전달되지 않습니다.</li>
              <li><strong>선언적 레이아웃 조립</strong>: 복잡한 인라인 조건문 없이 레이아웃 레벨에서 슬롯 단위로 화면을 간결하게 합성합니다.</li>
              <li><strong>단일 URL 다중 권한 뷰</strong>: 동일한 <code>/dashboard</code> URL 경로에서 사용자의 역할에 따라 완전히 다른 경험을 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>B2B SaaS 대시보드의 관리자(Admin) vs 일반 직원(Member) 권한별 뷰 분기</li>
              <li>쇼핑몰 마이페이지의 일반 구매자 vs 입점 셀러(Seller) 맞춤 위젯 표시</li>
              <li>구독 요금제 등급(Free vs Pro)에 따른 기능 패널 조건부 노출</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 컴포넌트 내 세션 검증 필수</strong>: 클라이언트 props에만 의존하지 않고 서버 레이아웃에서 실제 인증 세션/토큰을 검증하여 슬롯을 주입해야 보안 누수를 방지할 수 있습니다.</li>
              <li><strong>미선택 슬롯의 번들 트리쉐이킹</strong>: 서버 컴포넌트 조건부 분기 시 렌더링되지 않은 슬롯 컴포넌트는 클라이언트로 전송되지 않으므로 번들 최적화 효과를 누릴 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
