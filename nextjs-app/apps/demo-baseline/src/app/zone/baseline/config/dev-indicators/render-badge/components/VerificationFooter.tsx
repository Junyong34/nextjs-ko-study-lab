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

  const defaultExpected = "• devIndicators 렌더링 상태 개발 뱃지 제어의 동작과 기대 결과를 확인합니다."
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
        title="devIndicators 렌더링 상태 개발 뱃지 제어 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="next.config.ts devIndicators 개발 모드 렌더링 상태 인디케이터 제어">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>devIndicators</code> (<code>next.config.ts</code>) 설정은 Next.js 개발 모드 브라우저 화면 구석에 표시되는 정적/동적 렌더링 상태 뱃지 및 빌드 컴파일 인디케이터의 위치(<code>position</code>)나 노출 여부를 커스터마이징하는 개발 환경 설정입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 <code>devIndicators: {'{'} position: 'bottom-right' {'}'}</code> 설정을 통해 현재 페이지가 정적으로 생성되었는지 실시간 동적 렌더링 중인지 알려주는 번개/원형 뱃지의 위치를 UI 간섭이 없는 곳으로 조정하는 구성을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>페이지 렌더링 모드 즉시 식별</strong>: 코드가 정적(Static)으로 최적화되었는지 동적(Dynamic)으로 분기되었는지 브라우저에서 바로 확인합니다.</li>
              <li><strong>UI 컴포넌트 가림 방지</strong>: 화면 하단 플로팅 결제 버튼이나 챗봇 위젯과 개발 뱃지가 겹치는 간섭을 위치 조정을 통해 방지합니다.</li>
              <li><strong>직관적인 빌드 상태 피드백</strong>: HMR 컴파일 진행 상황을 시각적으로 파악하여 개발 흐름을 원활하게 유지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>모바일 뷰포트 반응형 테스트 시 하단 고정 탭바와 인디케이터 겹침 해결</li>
              <li>대규모 페이지들의 SSG vs SSR 렌더링 모드 실시간 시각적 감사</li>
              <li>디자인 QA 및 화면 캡처 시 개발 인디케이터 일시 비활성화</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>프로덕션 번들 자동 제거</strong>: <code>devIndicators</code>는 오직 <code>next dev</code> 실행 시에만 주입되며, <code>next build</code> 프로덕션 산출물에는 완전히 제거되어 배포됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
