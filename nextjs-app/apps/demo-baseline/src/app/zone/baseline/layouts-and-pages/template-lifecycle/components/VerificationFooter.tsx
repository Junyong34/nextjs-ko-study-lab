'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useTemplateLifecycle } from './TemplateLifecycleContext'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const lifecycle = useTemplateLifecycle()

  const defaultExpected =
    '• 다른 상품 탭(/product-2) 클릭 시 template.tsx가 완전히 언마운트된 후 새로운 DOM 인스턴스로 Re-mount\n• 새 인스턴스 ID 발급 및 작성 중이던 후기 폼 텍스트/별점 상태 자동 초기화'

  const hasRemounted = Boolean(
    lifecycle?.prevInstanceId &&
      lifecycle?.currentInstanceId &&
      lifecycle.prevInstanceId !== lifecycle.currentInstanceId,
  )

  const defaultActual = hasRemounted
    ? `• 이전 템플릿 인스턴스: #${lifecycle?.prevInstanceId} (파기됨)\n• 신규 템플릿 인스턴스: #${lifecycle?.currentInstanceId} (새로 마운트됨)\n• 폼 상태 초기화: 후기 ${lifecycle?.reviewLength || 0}자, 평점 ${lifecycle?.rating || 5}점 리셋 완료\n• 생명주기 검증: template.tsx 인스턴스 재생성(Re-mount) 정상 확인`
    : `• 현재 템플릿 인스턴스 ID: #${lifecycle?.currentInstanceId || '------'}\n• 이전 인스턴스: (초기 마운트 - 탭 전환 대기)\n• 후기 작성 폼: ${lifecycle?.reviewLength || 0}자 입력됨 (초기화 대기)\n• 상태: 평점/후기를 입력한 후 상단의 [오버핏 기모 맨투맨] 탭을 클릭하세요.`

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : hasRemounted
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="template.tsx 생명주기 및 인스턴스 재생성 실증 검증"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          'Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다.'
        }
      />
      <DemoDeepDiveCard title="template.tsx 생명주기 및 인스턴스 재생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>template.tsx</code>는 세그먼트 이동 시 상태를 유지하는 <code>layout.tsx</code>와 달리, 라우트 이동마다 새로운 컴포넌트 인스턴스를 생성하여 마운트/언마운트 생명주기를 재실행하고, <code>useState</code> 상태 초기화, <code>useEffect</code> 재실행, CSS 진입 애니메이션을 트리거하는 표준 파일 컨벤션입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 상품 탭(에어 줌 프로 러닝화 ↔ 오버핏 기모 맨투맨)을 전환할 때 <code>layout.tsx</code>의 탭 내비게이션 셸은 유지되는 반면, <code>template.tsx</code> 내부의 별점 선택, 후기 텍스트 입력값 및 인스턴스 고유 ID가 새로운 인스턴스로 마운트되어 깨끗하게 초기화되는 생명주기 동작을 시각화합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>진입/이탈 애니메이션 자동 트리거</strong>: 페이지 전환 시마다 DOM이 새로 마운트되어 Framer Motion이나 CSS 페이드인 효과를 자연스럽게 연출합니다.</li>
              <li><strong>페이지별 클라이언트 상태 강제 초기화</strong>: 이전 페이지에서 입력하던 임시 폼 데이터나 모달 열림 상태를 안전하게 자동 리셋합니다.</li>
              <li><strong>페이지 뷰 로깅(Analytics) 정확한 수집</strong>: <code>useEffect</code> 마운트 시점을 감지하여 경로 전환 시마다 페이지 체류/방문 이벤트를 정확히 로깅합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세 페이지 간 이동 시마다 리뷰 작성 폼 및 수량 선택 카운터 자동 리셋</li>
              <li>쇼핑몰 주요 기획전 진입 시 화려한 모션 그래픽 및 슬라이드 인 애니메이션 연출</li>
              <li>페이지 전환 시마다 Google Analytics / Amplitude 페이지뷰 추적 비콘 발송</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>불필요한 렌더링 비용 주의</strong>: 단순 레이아웃 공유 목적이라면 상태 보존과 캐싱에 유리한 <code>layout.tsx</code>를 기본으로 사용하고, 인스턴스 재생성이 반드시 필요한 경우에만 <code>template.tsx</code>를 선택해야 합니다.</li>
              <li><strong>컴포넌트 렌더 계층 순서</strong>: App Router의 렌더 트리는 <code>Layout {'>'} Template {'>'} ErrorBoundary {'>'} Suspense {'>'} Page</code> 순서로 중첩됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
