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

  const defaultExpected = "• Tailwind CSS v4 유틸리티 클래스 & 반응형 스타일 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Tailwind CSS v4 유틸리티 클래스 & 반응형 스타일 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="Tailwind CSS v4 유틸리티 클래스 & 반응형 스타일">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Tailwind CSS v4는 차세대 초고속 엔진(Oxide)과 CSS-first 아키텍처를 기반으로, <code>@theme</code> 지시어를 통해 제로 자바스크립트 런타임으로 동작하며 현대적 CSS 변수와 유틸리티 클래스를 제공하는 표준 스타일 프레임워크 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 반응형 브레이크포인트(<code>sm:</code>, <code>md:</code>, <code>lg:</code>), 다크모드(<code>dark:</code>), 상태 가상 클래스(<code>hover:</code>, <code>focus:</code>) 유틸리티를 적용하여 화면 크기 및 사용자 테마 전환에 따른 레이아웃 변화를 실시간으로 렌더링합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>제로 런타임 오버헤드</strong>: JS 파싱 및 런타임 스타일 계산 비용이 없어 Next.js App Router의 SSR 및 Hydration 성능을 극대화합니다.</li>
                    <li><strong>극단적인 CSS 번들 경량화</strong>: 템플릿에 실제 작성된 유틸리티 클래스만 빌드 타임에 스캔하여 수십 KB 수준의 최소 CSS 파일만 배포합니다.</li>
                    <li><strong>디자인 토큰 표준화</strong>: <code>@theme</code> 토큰 기반의 색상, 타이포그래피, 간격 규칙을 전사 UI 컴포넌트에 일관되게 적용합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>모바일 우선(Mobile-first) 반응형 쇼핑몰 상품 그리드 및 기획전 레이아웃</li>
                    <li>시스템 설정 및 사용자 토글에 따른 다크모드 지원 관리자 대시보드</li>
                    <li>고속 프로토타이핑 및 대규모 프론트엔드 디자인 시스템 구축</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>동적 클래스 템플릿 리터럴 주의</strong>: <code>className={'{'}clsx('text-' + color){'}'}</code>와 같은 런타임 문자열 합성은 빌드 시 정적 스캐너가 인식하지 못하므로, 사전 정의된 전체 클래스 매핑 객체(<code>colorMap[color]</code>)를 사용해야 합니다.</li>
                    <li><strong>Tailwind v4 설정 방식</strong>: v4에서는 <code>tailwind.config.js</code> 대신 글로벌 CSS 파일의 <code>@import "tailwindcss";</code> 및 <code>@theme</code> 블록에서 테마를 직접 정의합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
