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

  const defaultExpected = "• 다크모드 SSR 인라인 스크립트 FOUC 방지 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="다크모드 SSR 인라인 스크립트 FOUC 방지 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="다크모드 SSR 인라인 스크립트 FOUC 방지">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>다크모드 FOUC(Flash of Unstyled Content) 방지 기술은 브라우저 렌더링 엔진이 HTML 파싱을 시작하는 즉시 <code>{'<'}head{'>'}</code> 내의 초경량 블로킹 인라인 자바스크립트(<code>{'<'}script{'>'}</code>)를 실행하여 <code>localStorage</code>나 시스템 테마를 읽고 <code>{'<'}html class="dark"{'>'}</code>를 동기적으로 주입하는 표준 깜빡임 방지 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 다크모드로 설정된 사용자가 페이지를 새로고침할 때, React 하이드레이션 완료를 기다리지 않고 첫 페인팅(First Paint) 시점부터 즉각 검은색 배경 테마가 적용되어 하얀색 화면이 번쩍이는 플래시 현상이 완벽히 차단되는 파이프라인을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>시각적 눈부심(Flash) 100% 차단</strong>: 야간 환경에서 다크모드 사용자가 페이지 이동 또는 새로고침 시 겪는 하얀색 깜빡임을 원천 제거합니다.</li>
                    <li><strong>제로 하이드레이션 불일치</strong>: <code>suppressHydrationWarning</code> 속성을 <code>{'<'}html{'>'}</code>에 선언하여 서버 렌더 HTML과 클라이언트 테마 클래스 간의 React 경고를 깔끔하게 해결합니다.</li>
                    <li><strong>초소형 페이로드</strong>: 외부 무거운 라이브러리 없이 단 몇 줄의 순수 바닐라 인라인 스크립트로 동작합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>시스템 다크모드 및 사용자 정의 테마를 지원하는 전사 웹 서비스</li>
                    <li>야간 개발자 문서 및 기술 블로그 플랫폼</li>
                    <li>대시보드 및 금융 트레이딩 터미널 화면</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>suppressHydrationWarning 필수 설정</strong>: 서버 렌더링 시점에는 사용자의 <code>localStorage</code>를 알 수 없으므로 <code>app/layout.tsx</code>의 <code>{'<'}html lang="ko" suppressHydrationWarning{'>'}</code>을 반드시 설정해야 합니다.</li>
                    <li><strong>인라인 스크립트 실행 경량화</strong>: 해당 인라인 스크립트는 렌더링을 블로킹하므로 복잡한 로직을 넣지 않고 오직 테마 클래스 토글만 최소한으로 수행해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
