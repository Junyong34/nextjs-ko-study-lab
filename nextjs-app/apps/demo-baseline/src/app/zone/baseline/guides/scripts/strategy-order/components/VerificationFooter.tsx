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

  const defaultExpected = "• next/script strategy 로드 순서 최적화의 동작과 기대 결과를 확인합니다."
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
        title="next/script strategy 로드 순서 최적화 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="next/script strategy 로드 순서 최적화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>next/script</code>의 <code>strategy</code> 속성은 서드파티 스크립트의 실행 타이밍(<code>beforeInteractive</code>, <code>afterInteractive</code>, <code>lazyOnload</code>, <code>worker</code>)을 선언적으로 제어하여, Core Web Vitals(LCP, INP, TBT) 점수를 극대화하는 성능 최적화 표준 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 보안 봇 탐지 스크립트(<code>beforeInteractive</code>), 구글 태그 매니저(<code>afterInteractive</code>), 고객 상담 채널톡 위젯(<code>lazyOnload</code>)을 각각 적절한 전략으로 배치하여 브라우저 리소스 로딩 파이프라인의 우선순위가 정렬되는 과정을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>토탈 블로킹 타임(TBT) 80% 감소</strong>: 마케팅 태그와 채팅 위젯 등 비핵심 스크립트를 유휴 시간(Idle)으로 지연시켜 메인 스레드 점유율을 대폭 낮춥니다.</li>
              <li><strong>필수 보안 스크립트 보장</strong>: Cloudflare Turnstile이나 봇 탐지 라이브러리는 HTML 파싱 단계에서 즉시 실행되어 악성 트래픽을 차단합니다.</li>
              <li><strong>웹 워커(Worker) 오프로딩</strong>: <code>strategy="worker"</code>(Partytown)를 사용하여 무거운 분석 스크립트를 메인 스레드 외부의 백그라운드 워커에서 실행할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 필수 봇 방어 및 디도스 차단 스크립트 (beforeInteractive)</li>
              <li>Google Tag Manager 및 사용자 행동 분석 스크립트 (afterInteractive)</li>
              <li>우측 하단 실시간 고객 문의 채팅 봇 위젯 (lazyOnload)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>beforeInteractive 사용 제약</strong>: <code>strategy="beforeInteractive"</code>는 반드시 Root Layout(<code>app/layout.tsx</code>)이나 Page 내부에서만 사용 가능하며 일반 중첩 컴포넌트에서는 동작하지 않습니다.</li>
              <li><strong>인라인 스크립트 id 필수</strong>: <code>{'<'}Script{'>'}</code> 내부에 인라인 코드를 작성할 때는 Next.js가 스크립트를 추적하고 중복 삽입을 방지할 수 있도록 고유한 <code>id</code> 속성을 필수로 부여해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
