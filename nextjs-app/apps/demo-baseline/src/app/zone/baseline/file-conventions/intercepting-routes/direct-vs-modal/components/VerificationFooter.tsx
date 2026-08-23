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

  const defaultExpected = "• 직접 진입 vs 모달 대조 (Intercepting Routes) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="직접 진입 vs 모달 대조 (Intercepting Routes) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="직접 진입(Direct) vs 모달 인터셉트(Modal) 렌더링 대조">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Intercepting Routes는 진입 방식에 따라 두 가지 렌더링 경로를 갖습니다. (1) 클라이언트 내비게이션(<code>{'<'}Link{'>'}</code>)으로 진입 시 인터셉트된 모달 UI(<code>(.)photos/[id]</code>), (2) 브라우저 주소창 직접 입력 또는 새로고침(F5) 시 독립 전체 페이지(<code>photos/[id]</code>)가 렌더링됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 상품 목록에서 클릭하여 진입한 [모달 뷰]와, 해당 URL을 복사하여 새 탭에서 직접 열거나 새로고침했을 때 렌더링되는 [독립 상세 페이지]의 레이아웃 구조와 헤더/GNB 차이를 실시간으로 대조 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>맥락 유지와 독립 뷰의 양립</strong>: 탐색 중인 사용자는 모달로 빠른 정보를 확인하고, 검색엔진 크롤러나 외부 공유 유입자는 완전한 전체 페이지를 소비합니다.</li>
              <li><strong>SEO 최적화</strong>: 직접 URL 진입 시 전체 메타데이터와 독립 HTML이 반환되어 완벽한 검색엔진 인덱싱을 지원합니다.</li>
              <li><strong>네이티브 앱급 제스처/내비게이션 UX</strong>: 웹 환경에서도 앱과 동일한 화면 계층 전환을 구현합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>소셜 미디어 게시물 상세 (피드 내 팝업 뷰 vs 단독 게시글 공유 페이지)</li>
              <li>쇼핑몰 퀵뷰 모달 vs 상품 상세 풀 페이지</li>
              <li>사용자 프로필 간이 팝업 vs 프로필 전체 대시보드</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>인터셉트 심볼 깊이 계산 주의</strong>: <code>(..)</code>는 라우트 세그먼트 기준의 한 단계 상위이므로 Route Group(<code>(group)</code>) 폴더는 세그먼트 단계 계산에서 제외됨에 유의해야 합니다.</li>
              <li><strong>모달 내부 독립 데이터 페칭</strong>: 모달 컴포넌트도 일반 Page와 동일하게 서버 컴포넌트로 동작하므로 필요한 데이터를 독립적으로 안전하게 페치할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
