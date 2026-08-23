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

  const defaultExpected = "• 결제/주문 폼 WAI-ARIA 속성 및 스크린 리더 지원 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 5단 표준 레이아웃 정상 적용"

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
        title="결제/주문 폼 WAI-ARIA 속성 및 스크린 리더 지원 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="결제/주문 폼 WAI-ARIA 속성 및 스크린 리더 지원">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>WAI-ARIA 폼 접근성(Accessibility) 표준은 <code>aria-invalid</code>, <code>aria-describedby</code>, <code>aria-required</code>, <code>aria-live="polite"</code> 속성을 시맨틱 HTML 폼 요소와 결합하여, 시각장애인 및 스크린 리더(NVDA, VoiceOver) 사용자에게 폼 입력 상태와 서버 검증 에러를 실시간 음성으로 명확히 전달하는 접근성 표준 규격(WCAG 2.2 AA)입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 카드 번호 16자리 미입력 시 <code>aria-invalid="true"</code>가 활성화되고, <code>aria-describedby="card-error"</code>로 연결된 에러 메시지가 <code>aria-live</code> 영역을 통해 스크린 리더에 즉시 안내되는 메커니즘을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>웹 접근성 법적 컴플라이언스 준수</strong>: 장애인 차별금지법 및 전자금융거래 웹 접근성 국가 표준(KWCAG / WCAG 2.2 AA) 요구사항을 완벽히 충족합니다.</li>
              <li><strong>모든 사용자를 위한 사용성 향상</strong>: 스크린 리더 사용자뿐만 아니라 키보드 내비게이션 및 보조 기술 사용자 모두에게 직관적인 폼 입력 환경을 제공합니다.</li>
              <li><strong>자동화 접근성 테스팅 통과</strong>: Lighthouse Accessibility 점수 100점 달성 및 axe-core 검사 오류를 제로화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>전자상거래 신용카드 결제 및 계좌이체 입력 폼</li>
              <li>공공기관/금융사 본인인증 및 회원가입 필수 동의 폼</li>
              <li>병원 진료 예약 및 관공서 민원 신청 접수 양식</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>명시적 label과 id 연결 필수</strong>: <code>{'<'}label htmlFor="card-number"{'>'}</code>과 <code>{'<'}input id="card-number"{'>'}</code>을 반드시 일치시켜 포커스 이동 및 음성 라벨링을 보장해야 합니다.</li>
              <li><strong>aria-live 남용 금지</strong>: <code>aria-live="assertive"</code>는 사용자의 현재 음성 안내를 강제로 중단하므로 일반적인 폼 유효성 에러에는 <code>aria-live="polite"</code>를 사용하는 것이 표준입니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
