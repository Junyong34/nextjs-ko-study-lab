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

  const defaultExpected = "• 서버 렌더링 vs 클라이언트 렌더링 수명주기 대조의 동작과 기대 결과를 확인합니다."
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
        title="서버 렌더링 vs 클라이언트 렌더링 수명주기 대조 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="서버 렌더링 vs 클라이언트 렌더링 수명주기 대조">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js App Router의 렌더링 철학은 기본적으로 모든 컴포넌트를 제로 번들 크기와 백엔드 직접 접근 권한을 가진 Server Component로 렌더링하고, 사용자 이벤트 리스너와 상태 관리가 필요한 부분만 <code>'use client'</code> Client Component로 선별 선언하여 최적의 성능을 달성하는 하이브리드 아키텍처 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 서버에서 직접 데이터베이스 쿼리를 수행하여 0KB 클라이언트 번들로 렌더링되는 [서버 컴포넌트 영역]과, <code>useState</code> 및 클릭 인터랙션을 처리하는 [클라이언트 컴포넌트 영역]의 수명 주기와 네트워크 전송 페이로드를 나란히 대조 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>클라이언트 번들 극단적 다이어트</strong>: 데이터 패칭, 마크다운 파서, 무거운 비즈니스 로직 라이브러리를 서버에만 남겨 번들 크기를 최소화합니다.</li>
                    <li><strong>보안 강화</strong>: 데이터베이스 연결 시크릿 키나 내부 비즈니스 알고리즘이 브라우저 소스코드에 전혀 노출되지 않습니다.</li>
                    <li><strong>SEO 및 초기 로딩 속도 최적화</strong>: 완성된 HTML이 브라우저에 첫 응답으로 도착하여 검색엔진 크롤링과 초기 렌더링(FCP)이 즉각 완료됩니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>상품 상세 페이지의 기본 정보 및 SEO 영역(Server) + 옵션 선택 및 장바구니 버튼(Client)</li>
                    <li>블로그 본문 마크다운 파싱 뷰어(Server) + 댓글 작성 및 좋아요 버튼(Client)</li>
                    <li>대시보드 통계 요약 카드(Server) + 실시간 필터 및 날짜 선택기(Client)</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>use client 지시어의 의미</strong>: <code>'use client'</code>는 컴포넌트가 클라이언트에서만 실행된다는 뜻이 아니라, 서버에서 사전 렌더링(SSR)된 후 브라우저에서 하이드레이션된다는 경계 선언입니다.</li>
                    <li><strong>시크릿 키 클라이언트 유출 방지</strong>: Client Component 내부에서는 <code>NEXT_PUBLIC_</code> 접두사가 없는 환경변수에 접근할 수 없으며 빈 문자열로 처리됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
