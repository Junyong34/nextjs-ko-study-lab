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

  const defaultExpected = "• Server and Client Component 합성과 children 슬롯 주입의 동작과 기대 결과를 확인합니다."
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
        title="Server and Client Component 합성과 children 슬롯 주입 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="Server and Client Component 합성과 children 슬롯 주입">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Server and Client Component 합성은 <code>'use client'</code> 컴포넌트 내부에 Server Component를 직접 import하지 않고, 부모 Server Component에서 자식 Server Component를 <code>children</code> 슬롯이나 JSX Props로 주입하여 서버 전용 렌더링 특성과 제로 번들 크기를 온전히 유지하는 핵심 합성 패턴입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 상태 관리를 담당하는 <code>{'<'}ClientTabContainer{'>'}</code>의 <code>children</code>으로 무거운 서버 데이터베이스 조회를 수행하는 <code>{'<'}ServerProductList{'>'}</code>를 전달하여, 클라이언트 번들에 서버 코드가 단 1바이트도 포함되지 않은 채 완벽한 인터랙션 탭 전환이 이루어지는 구조를 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>서버 컴포넌트의 클라이언트 번들 전락 방지</strong>: Client Component 파일 내부에서 Server Component를 직접 import할 때 발생하는 클라이언트 컴포넌트 강제 변환 사고를 방지합니다.</li>
                    <li><strong>데이터 페칭 성능 유지</strong>: 자식 컴포넌트가 서버에서 비동기 DB 조회를 수행하고 HTML/RSC 페이로드로 직렬화되어 브라우저로 전송됩니다.</li>
                    <li><strong>극대화된 컴포넌트 재사용성</strong>: 클라이언트 컨테이너(모달, 탭, 캐러셀, 드로어)를 범용 레이아웃 셸로 독립적으로 활용할 수 있습니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>인터랙티브 모달 팝업 내부의 서버 렌더링 상품 상세 정보 주입</li>
                    <li>스와이프 지원 클라이언트 캐러셀 컨테이너 내부의 실시간 추천 상품 피드 래핑</li>
                    <li>접이식 아코디언(Accordion) UI 내부의 자주 묻는 질문(FAQ) 서버 데이터 바인딩</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Direct Import 안티패턴</strong>: <code>'use client'</code> 파일 상단에 <code>import ServerComponent from './ServerComponent'</code>를 선언하면 해당 서버 컴포넌트가 클라이언트로 컴파일되므로 절대 금지해야 합니다.</li>
                    <li><strong>Props 슬롯의 유연성</strong>: <code>children</code>뿐만 아니라 <code>header={'{'}{'<'}ServerHeader /{'>'}{'}'}</code>, <code>footer={'{'}{'<'}ServerFooter /{'>'}{'}'}</code>와 같이 커스텀 JSX Props 슬롯으로도 서버 컴포넌트를 자유롭게 전달할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
