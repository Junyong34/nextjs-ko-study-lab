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

  const defaultExpected = "• 상점용 vs 관리자용 다중 루트 레이아웃의 동작과 기대 결과를 확인합니다."
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
        title="상점용 vs 관리자용 다중 루트 레이아웃 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="Route Groups 다중 루트 레이아웃 ((shop) vs (admin))">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              루트 디렉토리 직하위에 소괄호 폴더(<code>(shop)</code>, <code>(admin)</code>)를 배치하고 각각 <code>layout.tsx</code>를 정의하면, 단일 Next.js 프로젝트 내에서 서로 다른 <code>{'<'}html{'>'}</code>과 <code>{'<'}body{'>'}</code>를 갖는 복수의 독립된 루트 레이아웃(Multiple Root Layouts)을 구성할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 일반 쇼핑몰 고객 화면(<code>/(shop)/products</code> -{'>'} <code>/products</code>)과 관리자 콘솔(<code>/(admin)/dashboard</code> -{'>'} <code>/dashboard</code>)이 URL 경로에는 괄호 폴더를 노출하지 않으면서, 각각 고객용 GNB와 관리자 전용 다크 사이드바 레이아웃을 독립적으로 적용받는 구조를 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>완전한 UI 셸 격리</strong>: 쇼핑몰 프론트엔드와 관리자 백오피스가 전역 CSS, 폰트, 테마 프로바이더를 서로 간섭 없이 독립적으로 유지합니다.</li>
              <li><strong>URL 구조의 순수성 보존</strong>: 폴더명 괄호 <code>(group)</code>는 URL에 전혀 포함되지 않아 깔끔하고 일관된 URL을 유지합니다.</li>
              <li><strong>번들 크기 최적화</strong>: 관리자용 무거운 차트/테이블 라이브러리가 일반 사용자용 쇼핑몰 번들에 포함되지 않도록 분리합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>일반 사용자 스토어프론트와 판매자 관리자 센터의 루트 레이아웃 분리</li>
              <li>인증 전용 페이지(로그인/회원가입)의 무(No) 헤더/푸터 레이아웃</li>
              <li>마케팅 랜딩 페이지와 SaaS 대시보드 앱 영역의 분리</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>최상위 app/layout.tsx 삭제 필수</strong>: 다중 루트 레이아웃을 사용할 때는 <code>app/layout.tsx</code>가 존재하면 안 되며, 각 Route Group(<code>(shop)/layout.tsx</code>, <code>(admin)/layout.tsx</code>)이 자체 <code>{'<'}html{'>'}</code>과 <code>{'<'}body{'>'}</code>를 반드시 포함해야 합니다.</li>
              <li><strong>루트 간 이동 시 Full Page Reload</strong>: 서로 다른 루트 레이아웃 간을 이동할 때는 레이아웃 셸 자체가 교체되므로 React Partial Rendering이 아닌 전체 페이지 리로드가 발생합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
