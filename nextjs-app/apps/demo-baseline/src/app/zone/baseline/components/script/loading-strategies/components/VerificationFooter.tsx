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

  const defaultExpected = "• next/script 로딩 전략 상세 비교의 동작과 기대 결과를 확인합니다."
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
        title="next/script 로딩 전략 상세 비교 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="next/script 로딩 전략 (beforeInteractive / afterInteractive / lazyOnload / worker)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/script</code> 컴포넌트는 외부 서드파티 자바스크립트(SDK, 애널리틱스, 챗봇 등)의 로딩 타이밍과 우선순위를 <code>strategy</code> 속성(<code>beforeInteractive</code>, <code>afterInteractive</code>, <code>lazyOnload</code>, <code>worker</code>)을 통해 선언적으로 제어하여 메인 스레드 블로킹을 방지하는 Next.js 최적화 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 보안 봇 감지 스크립트(<code>beforeInteractive</code>), GA4 웹로그 분석기(<code>afterInteractive</code>), 고객센터 실시간 채팅 위젯(<code>lazyOnload</code>)을 서로 다른 전략으로 배치하여, 핵심 페이지 렌더링에 미치는 TBT(Total Blocking Time) 영향을 비교 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>메인 스레드 경합 최소화</strong>: 중요도가 낮은 위젯 스크립트의 실행을 브라우저 유휴 시간(Idle)으로 미루어 초기 인터랙션 지연(INP/TBT)을 줄입니다.</li>
              <li><strong>스크립트 중복 로드 자동 방지</strong>: 여러 페이지에서 동일한 <code>{'<'}Script{'>'}</code>를 호출해도 Next.js가 한 번만 주입하도록 보장합니다.</li>
              <li><strong>웹 워커(Web Worker) 오프로딩</strong>: <code>strategy="worker"</code>(Partytown 결합)를 통해 무거운 추적 스크립트를 백그라운드 스레드로 격리 실행합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>페이지 로드 전 필수 실행되는 봇 방지/인증 스크립트 (<code>beforeInteractive</code>)</li>
              <li>Google Analytics / Tag Manager 등 기본 웹로그 분석기 (<code>afterInteractive</code>)</li>
              <li>카카오톡 상담 챗봇 / 채널톡 / 설문조사 위젯 (<code>lazyOnload</code>)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>beforeInteractive 배치 위치 제약</strong>: <code>strategy="beforeInteractive"</code>는 반드시 루트 <code>app/layout.tsx</code> 내부에 배치해야 하며 중첩 세그먼트 페이지에는 사용할 수 없습니다.</li>
              <li><strong>인라인 스크립트 실행</strong>: 인라인 코드를 작성할 때는 <code>{'<'}Script id="my-script"{'>'}{'{'}`...`{'}'}{'<'}/Script{'>'}</code>와 같이 고유 <code>id</code> 속성을 필수로 지정해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
