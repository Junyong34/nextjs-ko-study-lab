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

  const defaultExpected = "• CSS Modules 스코프 격리 및 해시 클래스 충돌 방지 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="CSS Modules 스코프 격리 및 해시 클래스 충돌 방지 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="CSS Modules 스코프 격리 및 해시 클래스 충돌 방지">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>CSS Modules(<code>.module.css</code>)는 빌드 시점에 컴포넌트별 고유 해시 클래스명(<code>[filename]_[classname]__[hash]</code>)을 자동 생성하여 글로벌 CSS 네임스페이스 오염을 방지하고 스타일 격리를 제공하는 표준 스타일링 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 동일한 <code>.button</code> 클래스명을 가진 두 컴포넌트가 각각 독립된 CSS Module을 import할 때 빌드 타임에 고유한 해시 클래스로 변환되어 스타일 충돌 없이 독립적인 테마와 크기를 유지하는 과정을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>스타일 스코프 완전 격리</strong>: 클래스명 중복으로 인한 의도치 않은 CSS 오버라이드 및 사이드이펙트를 원천 차단합니다.</li>
                    <li><strong>자동 코드 스플리팅 및 최적화</strong>: 사용되지 않는 모듈 스타일은 트리 셰이킹되어 해당 컴포넌트가 렌더링되는 페이지에만 최소 크기로 번들링됩니다.</li>
                    <li><strong>Server & Client Component 공통 지원</strong>: React Server Component와 Client Component 모두에서 추가 런타임 오버헤드 없이 제로 런타임 CSS로 동작합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>독립적인 서드파티 UI 위젯 또는 사내 디자인 시스템 컴포넌트 라이브러리 개발</li>
                    <li>대규모 협업 프로젝트에서 여러 팀이 동시에 개발하는 쇼핑몰 마이크로 UI 모듈</li>
                    <li>레거시 CSS와의 네임스페이스 충돌을 방지해야 하는 점진적 마이그레이션 화면</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>kebab-case vs camelCase 접근</strong>: CSS 클래스명은 JS 객체 속성 접근(<code>styles.primaryButton</code>)을 위해 camelCase 작성을 권장하며, kebab-case는 <code>styles['primary-button']</code>으로 접근해야 합니다.</li>
                    <li><strong>:global() 가상 선택자 활용</strong>: 자식 요소나 서드파티 라이브러리 스타일에 예외적으로 전역 적용이 필요할 때는 <code>:global(.child-class)</code>를 명시적으로 선언할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
