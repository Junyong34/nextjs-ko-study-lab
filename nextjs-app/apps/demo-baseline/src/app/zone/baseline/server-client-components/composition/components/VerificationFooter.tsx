'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  liked?: boolean
  likes?: number
  specsCount?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { liked, likes = 142, specsCount = 6 } = props

  const defaultExpected =
    '• Server Component(ProductSpecsServer): 정적 상품 스펙(미드솔, 플레이트 등 6개 항목) 서버 렌더링\n• Client Component(WishlistButtonClient): 클릭 시 로컬 상태(useState)로 142 → 143 카운트 및 [찜 완료] 뱃지 전환\n• 상위 서버 컴포넌트 본문은 재렌더링 없이 유지'

  const defaultActual = liked
    ? `• 서버 렌더링 스펙: ${specsCount}개 제원 항목 유지 (서버 재요청 없음)\n• 위시리스트 상태: 찜 완료 (${likes}개, +1 정상 반영)\n• 번들 최적화: 클릭 인터랙션만 'use client'로 분리 격리 확인\n• Server & Client Components 합성 검증 완료`
    : `• 서버 렌더링 스펙: ${specsCount}개 제원 항목 로드 완료 (서버 직접 쿼리)\n• 위시리스트 상태: 미담기 (${likes}개)\n• 합성 경계: RSC 본문 + RCC 말단 버튼 구성\n• 상태: 하단 [위시리스트 담기] 버튼을 클릭하세요.`

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : liked
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Server & Client Components 합성 및 경계 분리 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          '이 예제의 동작과 검증 결과를 표시합니다.'
        }
      />
      <DemoDeepDiveCard title="Server & Client Components 합성 및 경계 분리">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              React Server Components(RSC) 아키텍처에서 Server Component를 Client Component(<code>'use client'</code>)의 <code>children</code> 슬롯이나 Props로 전달함으로써, 자식 컴포넌트가 클라이언트 번들에 포함되지 않고 서버에서 독립적으로 렌더링되도록 보장하는 컴포넌트 합성(Composition) 표준 패턴입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 서버에서만 렌더링되는 상세 제원 컴포넌트(<code>{'<'}ProductSpecsServer{'>'}</code>)와 사용자 클릭 인터랙션을 담당하는 클라이언트 위시리스트 버튼(<code>{'<'}WishlistButtonClient{'>'}</code>)을 합성하여, 전체 페이지를 RCC로 만들지 않고 인터랙션이 필요한 말단 버튼만 클라이언트 컴포넌트로 격리하는 RSC 합성 표준 패턴을 검증합니다.
            </p>
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
              <li>인터랙티브 모달/탭 컨테이너 내부에 서버에서 렌더링된 실시간 상품 카드 목록 주입</li>
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
