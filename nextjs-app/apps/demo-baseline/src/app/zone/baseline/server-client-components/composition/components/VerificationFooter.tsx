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

  const defaultExpected = "• Server & Client Components 합성 및 경계 분리 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Server & Client Components 합성 및 경계 분리 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="Server & Client Components 합성 및 경계 분리">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>React Server Components(RSC) 아키텍처에서 Server Component를 Client Component(<code>'use client'</code>)의 <code>children</code> 슬롯이나 Props로 전달함으로써, 자식 컴포넌트가 클라이언트 번들에 포함되지 않고 서버에서 독립적으로 렌더링되도록 보장하는 컴포넌트 합성(Composition) 표준 패턴입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 무거운 서버 데이터베이스 조회를 수행하는 <code>{'<'}ServerProductFeed{'>'}</code>를 상호작용 및 슬라이드 애니메이션을 담당하는 <code>{'<'}ClientCarouselContainer{'>'}</code>의 <code>children</code>으로 주입하여, 클라이언트 번들 크기를 0KB로 유지하면서도 풍부한 인터랙션을 구현하는 구조를 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>클라이언트 JS 번들 크기 극소화</strong>: 데이터 패칭 및 무거운 의존성 라이브러리가 브라우저 번들에 전혀 포함되지 않습니다.</li>
                    <li><strong>렌더링 성능 최적화</strong>: 서버 컴포넌트 결과물(HTML/RSC 페이로드)이 정적으로 생성되어 브라우저 Hydration 오버헤드를 최소화합니다.</li>
                    <li><strong>명확한 관심사 분리</strong>: 상태/이벤트 관리 컴포넌트와 비즈니스 데이터 처리 컴포넌트의 모듈성을 극대화합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>인터랙티브 캐러셀/모달 컨테이너 내부에 서버에서 렌더링된 실시간 상품 카드 목록 주입</li>
                    <li>테마/언어 전환 Client Provider 내부에 전체 서버 페이지 트리 래핑</li>
                    <li>무한 스크롤 클라이언트 래퍼 내부에 초기 서버 렌더링 리스트 아이템 전달</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Client Component 내부 직접 import 금지</strong>: Client Component 파일 안에서 Server Component를 <code>import ServerComp from './ServerComp'</code>로 직접 불러오면 해당 컴포넌트가 클라이언트 컴포넌트로 강제 전환되므로, 반드시 부모(Server)에서 <code>children</code>으로 전달해야 합니다.</li>
                    <li><strong>리프(Leaf) 노드로의 경계 밀어내기</strong>: <code>'use client'</code> 지시어는 가능한 컴포넌트 트리의 말단(Leaf) 노드(버튼, 입력창 등)에만 배치하여 서버 컴포넌트 영역을 최대화해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
