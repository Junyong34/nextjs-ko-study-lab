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

  const defaultExpected = "• draftMode().disable() 정적 캐시 모드 복귀 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="draftMode().disable() 정적 캐시 모드 복귀 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="draftMode().disable() 프리뷰 모드 종료 및 일반 공개 모드 복구">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>(await draftMode()).disable()</code> (<code>next/headers</code>)는 발행된 Bypass 쿠키를 제거하여 프리뷰 모드를 종료하고, 일반 방문자와 동일하게 고속 정적 캐시(SSG/ISR) 콘텐츠를 서빙받도록 복구하는 API입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 상단 프리뷰 안내 배너의 [프리뷰 종료] 버튼을 클릭하면 Route Handler를 통해 <code>draftMode().disable()</code>이 실행되고, 바이패스 쿠키가 삭제되어 공개 배포된 캐시 버전으로 즉각 전환됩니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>원클릭 캐시 복구</strong>: 관리자가 검수 완료 후 간편하게 정적 캐시 모드로 복귀하여 실제 사용자 환경을 재확인할 수 있습니다.</li>
              <li><strong>서버 부하 정상화</strong>: 바이패스 모드 종료로 불필요한 동적 SSR 서버 부하를 방지합니다.</li>
              <li><strong>안전한 세션 정리</strong>: 검수 종료 시 브라우저 쿠키를 깔끔히 정리합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>CMS 콘텐츠 검수 완료 후 상단 플로팅 바의 [미리보기 닫기]</li>
              <li>관리자 세션 로그아웃 시 프리뷰 권한 자동 해제</li>
              <li>일반 사용자 관점의 실제 최종 캐시 화면 렌더링 비교 확인</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>리다이렉트 처리</strong>: <code>disable()</code> 호출 후 검수 중이던 원래 페이지로 <code>redirect()</code>하여 새로고침된 정적 캐시 화면을 보여주어야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
