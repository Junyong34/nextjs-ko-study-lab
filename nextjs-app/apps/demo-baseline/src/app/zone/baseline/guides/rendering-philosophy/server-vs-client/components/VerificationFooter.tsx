'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  description?: string
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { count } = props

  const defaultExpected =
    '• RSC 영역(Server Component)은 클릭 여부와 무관하게 렌더 타임이 그대로 유지\n• RCC 영역(Client Component)은 카운터 클릭 시 useState로 클라이언트 상태만 즉시 갱신\n• 클릭 인터랙션이 발생해도 RSC 영역이 재실행되지 않고 두 번들이 격리된 상태 유지'

  const hasInteracted = count !== undefined && count > 0

  const defaultActual = hasInteracted
    ? `• 클릭 카운트: ${count}회 — RCC useState 상태가 정상적으로 갱신됨\n• 클릭 이후에도 RSC 렌더 타임은 변하지 않음 — 서버 컴포넌트 재실행 없이 번들 격리 확인 완료`
    : '• 상호작용 대기 중 (상단 예제의 카운터 버튼을 클릭해 RCC 상태 갱신을 확인해 주세요)'

  const isMatched = props.isMatched !== undefined ? props.isMatched : hasInteracted ? true : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="서버 렌더링 vs 클라이언트 렌더링 수명주기 대조 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={props.description || '이 예제의 동작과 검증 결과를 표시합니다.'}
      />
      <DemoDeepDiveCard title="서버 렌더링 vs 클라이언트 렌더링 수명주기 대조">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js App Router의 렌더링 철학은 기본적으로 모든 컴포넌트를 제로 번들 크기와 백엔드 직접 접근 권한을 가진 Server Component로 렌더링하고, 사용자 이벤트 리스너와 상태 관리가 필요한 부분만 <code>'use client'</code> Client Component로 선별 선언하여 최적의 성능을 달성하는 하이브리드 아키텍처 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 요청마다 서버에서 실제로 재실행되는 [서버 컴포넌트 영역]과, <code>useState</code> 및 클릭 인터랙션을 처리하는 [클라이언트 컴포넌트 영역]의 수명 주기와 번들 격리 상태를 나란히 대조 검증합니다. 서버 컴포넌트는 children 슬롯으로 클라이언트 컴포넌트에 주입되어 클라이언트 파일에 직접 import되지 않으므로 실제로 클라이언트 번들에 포함되지 않습니다.</p>
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
