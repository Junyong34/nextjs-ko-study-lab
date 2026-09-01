'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { FormState } from '../types'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  state?: FormState
  segmentSimulated?: boolean
  globalSimulated?: boolean
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { state, segmentSimulated, globalSimulated } = props

  const defaultExpected =
    '• 1계층: 예상된 폼 에러(400)를 useActionState 값으로 안전하게 반환 및 인라인 표시\n• 2계층: 세그먼트 런타임 예외를 error.tsx로 격리하고 reset()으로 복구\n• 3계층: 루트 레이아웃 크래시를 global-error.tsx (<html><body>) 최상위 폴백으로 포착'

  const hasInteracted = Boolean(state?.message) || segmentSimulated || globalSimulated

  let defaultActual = '• 인터랙션 대기 중 (1. 폼 유효성 에러 테스트, 2. 세그먼트 예외 시뮬레이션, 3. 전역 에러 시뮬레이션을 실행하세요)'
  if (hasInteracted) {
    defaultActual = `• 1계층(Expected): ${
      state?.message ? `useActionState 처리 완료 ("${state.message}")` : '대기 중'
    }\n• 2계층(Segment): ${
      segmentSimulated ? 'error.tsx 격리 및 복구 시뮬레이션 완료' : '대기 중'
    }\n• 3계층(Global): ${
      globalSimulated ? 'global-error.tsx (<html><body>) 루트 크래시 포착 시뮬레이션 완료' : '대기 중'
    }\n• 동작 상태: 3계층 에러 핸들링 아키텍처 검증 결과 완료`
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
        title="Next.js 3계층 에러 핸들링 아키텍처 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          '이 예제의 동작과 검증 결과를 표시합니다.'
        }
      />
      <DemoDeepDiveCard title="global-error.tsx 루트 레이아웃 에러 처리 & 3계층 에러 아키텍처">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>app/global-error.tsx</code>는 최상위 루트 레이아웃(<code>app/layout.tsx</code>)에서 발생하는 치명적 렌더링 에러를 포착하는 최후의 에러 바운더리입니다. 루트 레이아웃을 완전히 대체하므로 자체적인 <code>{'<'}html{'>'}</code>과 <code>{'<'}body{'>'}</code> 태그를 반드시 정의해야 합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 예상된 폼 에러(<code>useActionState</code> 400 반환), 세그먼트 예외(<code>error.tsx</code> 상위 레이아웃 보존 격리), 루트 레이아웃 크래시(<code>global-error.tsx</code> 전역 폴백)의 3가지 에러 계층을 각각 시뮬레이션하여 격리 범위와 복구 메커니즘의 차이를 실시간 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>완전한 3계층 에러 방어망 완성</strong>: 컴포넌트(ErrorBoundary) → 세그먼트(error.tsx) → 전역 루트(global-error.tsx)로 이어지는 무결점 에러 핸들링 아키텍처를 구축합니다.</li>
              <li><strong>브라우저 흰 화면(White Screen) 방지</strong>: 루트 레벨 장애 상황에서도 사용자에게 친절한 시스템 점검 안내 및 고객센터 링크를 제공합니다.</li>
              <li><strong>센트리(Sentry) 전역 에러 캡처</strong>: 앱 전체가 크래시되는 치명적 이벤트를 모니터링 APM에 누락 없이 전송합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>루트 레이아웃의 전역 세션 쿠키 파싱 실패 또는 인증 토큰 디코딩 크래시</li>
              <li>전역 테마/다국어(i18n) 설정 프로바이더 초기화 단계의 런타임 예외</li>
              <li>CDN 장애 또는 정적 폰트/스타일시트 로드 실패에 따른 루트 레이아웃 붕괴</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>프로덕션 빌드에서만 동작</strong>: 개발(development) 모드에서는 Next.js 고유의 개발자 에러 오버레이가 우선 표시되며, <code>global-error.tsx</code>는 <code>next build</code> 후 프로덕션 실행 시 동작합니다.</li>
              <li><strong>루트 태그 누락 금지</strong>: <code>{'<'}html{'>'}</code>과 <code>{'<'}body{'>'}</code> 태그를 생략하면 브라우저 DOM 파싱 에러가 발생하므로 반드시 루트 마크업을 직접 포함해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
