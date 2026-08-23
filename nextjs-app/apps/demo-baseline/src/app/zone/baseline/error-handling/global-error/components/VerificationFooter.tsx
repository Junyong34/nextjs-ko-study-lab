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

  const defaultExpected = "• 예상된 에러 vs 예외 vs global-error 계층 처리 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="예상된 에러 vs 예외 vs global-error 계층 처리 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
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
              루트 레이아웃의 전역 테마 프로바이더나 인증 세션 로딩 중 복구 불가능한 런타임 크래시가 발생하면, <code>global-error.tsx</code>가 활성화되어 독립적인 HTML 문서 구조로 시스템 긴급 복구 화면 및 [서비스 새로고침] 버튼을 렌더링합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>완전한 3계층 에러 방어망 완성</strong>: 컴포넌트(ErrorBoundary) -{'>'} 세그먼트(error.tsx) -{'>'} 전역 루트(global-error.tsx)로 이어지는 무결점 에러 핸들링 아키텍처를 구축합니다.</li>
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
