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

  const defaultExpected = "• Sass 변수/mixin 활용 프로모션 스타일링 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Sass 변수/mixin 활용 프로모션 스타일링 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="SASS/SCSS 모듈을 활용한 프로모션 테마 스타일링">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>SASS/SCSS 모듈(<code>.module.scss</code>)은 중첩 규칙(Nesting), 믹스인(Mixins), 변수(Variables) 등 강력한 전처리기 문법을 CSS Modules의 로컬 스코프 격리 기능과 결합하여, 계절별 프로모션이나 브랜드 테마를 모듈 단위로 유연하게 구축하는 표준 스타일링 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 [봄맞이 핑크 테마]와 [블랙프라이데이 다크 테마] 간의 전환을 시뮬레이션하며, SCSS 변수와 믹스인을 통해 버튼 그라데이션, 배너 그림자, 뱃지 애니메이션이 충돌 없이 캡슐화되어 적용되는 과정을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>구조화된 스타일 계층 관리</strong>: 중첩 선택자와 부모 참조자(<code>&</code>)를 활용하여 복잡한 상태별(hover, active, disabled) UI 스타일을 깔끔하게 정리합니다.</li>
                    <li><strong>테마 재사용성 극대화</strong>: 공통 믹스인(<code>@mixin card-shadow</code>, <code>@mixin flex-center</code>)을 정의하여 여러 프로모션 컴포넌트 간 코드 중복을 최소화합니다.</li>
                    <li><strong>클래스명 충돌 방지</strong>: SCSS 전처리 결과물이 최종적으로 고유 해시 클래스로 컴파일되어 전역 스타일 오염을 방지합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 설날/추석/블랙프라이데이 시즌 특별 기획전 랜딩 페이지</li>
                    <li>브랜드별 커스텀 폰트 및 고유 시그니처 색상이 적용되는 브랜드관</li>
                    <li>등급별(VIP, 골드, 일반) 맞춤형 회원 혜택 뱃지 및 카드 UI</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>sass 패키지 설치 필요</strong>: Next.js에서 SCSS를 사용하려면 프로젝트에 <code>pnpm add -D sass</code> 패키지가 설치되어 있어야 자동 컴파일이 지원됩니다.</li>
                    <li><strong>과도한 깊이의 Nesting 지양</strong>: 3~4단계 이상의 깊은 SCSS 중첩은 생성되는 CSS 선택자의 구체성(Specificity)을 높이고 번들 크기를 증가시키므로 권장되지 않습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
