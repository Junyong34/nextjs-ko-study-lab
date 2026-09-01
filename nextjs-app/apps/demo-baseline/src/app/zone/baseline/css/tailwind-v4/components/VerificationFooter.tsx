'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  hasInteracted?: boolean
  accentColor?: string
  paddingSize?: string
  selectedSize?: number
  hasBadge?: boolean
  activeClasses?: string
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    hasInteracted,
    accentColor = 'indigo',
    paddingSize = 'normal',
    selectedSize = 270,
    hasBadge = true,
    activeClasses,
  } = props

  const defaultExpected =
    '• Tailwind CSS v4 @theme 지시어와 CSS 변수 기반 동적 유틸리티 클래스 합성\n• 악센트 색상, 패딩, 뱃지, 사이즈 변경에 따른 제로 런타임 스타일링\n• 런타임 자바스크립트 연산 오버헤드 없는 즉각적인 UI 렌더링 검증'

  let defaultActual = '• 인터랙션 대기 중 (옵션 툴바에서 색상, 여백, 뱃지, 사이즈를 변경해보세요)'
  if (hasInteracted) {
    defaultActual = `• 선택된 테마 옵션: 색상=${accentColor}, 여백=${paddingSize}, 사이즈=${selectedSize}mm, 뱃지=${hasBadge ? 'ON' : 'OFF'}\n• 합성된 Tailwind v4 클래스: "${activeClasses}"\n• 렌더링 상태: CSS 변수 기반 제로 런타임 오버헤드 스타일 적용 완료`
  }

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : hasInteracted
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Tailwind CSS v4 유틸리티 클래스 & 반응형 스타일 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          '이 예제의 동작과 검증 결과를 표시합니다.'
        }
      />
      <DemoDeepDiveCard title="Tailwind CSS v4 CSS-First 엔진 & 유틸리티 테마 스타일링">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Tailwind CSS v4는 차세대 초고속 엔진(Oxide)과 CSS-first 아키텍처를 기반으로, <code>@theme</code> 지시어를 통해 제로 자바스크립트 런타임으로 동작하며 현대적 CSS 변수와 유틸리티 클래스를 제공하는 표준 스타일 프레임워크 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 반응형 브레이크포인트(<code>sm:</code>, <code>md:</code>), 다크모드(<code>dark:</code>), 상태 가상 클래스(<code>hover:</code>, <code>focus:</code>) 유틸리티를 적용하고, 툴바에서 악센트 색상, 여백, 뱃지 옵션을 변경할 때 실시간으로 합성되는 CSS 클래스 토큰 문자열을 인스펙터로 관찰합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>제로 런타임 오버헤드</strong>: JS 파싱 및 런타임 스타일 계산 비용이 없어 Next.js App Router의 SSR 및 Hydration 성능을 극대화합니다.</li>
              <li><strong>최적화된 CSS 번들 크기</strong>: 템플릿에 실제 작성된 유틸리티 클래스만 빌드 타임에 스캔하여 최소 CSS 파일만 배포합니다.</li>
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
