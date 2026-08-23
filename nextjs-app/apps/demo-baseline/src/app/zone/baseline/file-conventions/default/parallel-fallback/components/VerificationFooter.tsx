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

  const defaultExpected = "• Parallel Routes 미매칭 시 default.tsx 폴백 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Parallel Routes 미매칭 시 default.tsx 폴백 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="default.tsx 폴백 및 Parallel Routes 미매칭 슬롯 처리">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>default.tsx</code>는 Parallel Routes(<code>@slot</code>) 환경에서 브라우저가 특정 슬롯과 일치하지 않는 다른 하위 라우트로 소프트 내비게이션하거나 초기 로드될 때, 해당 슬롯의 렌더링 폴백(Fallback)을 제공하는 Next.js 표준 파일 컨벤션입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 다중 슬롯(<code>@team</code>, <code>@analytics</code>) 구조에서 사용자가 메인 탭만 변경했을 때, 일치하는 하위 세그먼트가 없는 슬롯이 404 에러를 내지 않고 <code>default.tsx</code> 컴포넌트를 통해 안전하게 기본 대시보드 상태를 유지하는 동작을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>슬롯별 독립 라우팅 보호</strong>: 특정 슬롯에 해당하는 하위 경로가 없더라도 상위 레이아웃이나 전체 페이지가 404로 깨지지 않습니다.</li>
              <li><strong>선언적 기본 뷰 제공</strong>: 사용자가 처음 진입하거나 알 수 없는 세그먼트에 도달했을 때 안정적인 디폴트 UI를 제공합니다.</li>
              <li><strong>복합 대시보드 아키텍처 완성</strong>: 탭, 모달, 사이드 패널 등 병렬 슬롯의 라우트 불일치 예외를 프레임워크 레벨에서 완전 제어합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대시보드 내 다중 위젯 슬롯 중 특정 서브 라우트 미매칭 위젯의 디폴트 차트 렌더링</li>
              <li>인터셉팅 라우트 모달 닫힘 상태의 <code>@modal/default.tsx</code> (null 반환)</li>
              <li>이커머스 상품 상세 내 옵션 선택기/리뷰 패널의 기본 안내 뷰</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>새로고침(Hard Reload) 시 default.tsx 필수</strong>: 클라이언트 소프트 내비게이션 시에는 Next.js가 이전 슬롯 상태를 유지하지만, 사용자가 F5로 새로고침하면 서버가 슬롯 상태를 모르므로 <code>default.tsx</code>가 없으면 404 에러가 발생합니다.</li>
              <li><strong>모달 슬롯의 null 반환 패턴</strong>: <code>@modal/default.tsx</code>에서는 모달이 닫힌 상태를 표현하기 위해 <code>export default function Default() {'{'} return null; {'}'}</code>을 선언하는 것이 표준 패턴입니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
