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

  const defaultExpected = "• 정적 HTML 카탈로그 사전 생성의 동작과 기대 결과를 확인합니다."
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
        title="정적 HTML 카탈로그 사전 생성 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="정적 HTML 카탈로그 사전 생성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>정적 카탈로그 사전 생성은 <code>generateStaticParams</code>를 활용하여 수천 개의 상품 상세 경로(<code>/products/[id]</code>)를 빌드 시점에 개별 <code>.html</code> 파일로 일괄 렌더링하고, CDN 엣지 노드에 즉시 배포하여 초저지연 상품 브라우징을 제공하는 정적 최적화 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 빌드 시점에 사전 생성된 상품 4종(<code>PROD-001</code> ~ <code>PROD-004</code>)의 정적 HTML 파일을 로드하여, 서버 연산 없이 즉각적인 0ms 페이지 전환과 완벽한 SEO 마크업 구조를 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>트래픽 폭주 시 오리진 서버 완전 보호</strong>: 블랙프라이데이 등 대규모 접속 폭주 시에도 모든 상품 페이지가 CDN 엣지에서 정적 서빙되어 DB 장애가 발생하지 않습니다.</li>
              <li><strong>검색엔진 최적화(SEO) 완벽 지원</strong>: 모든 상품의 설명, 가격, 구조화 데이터가 정적 HTML 소스에 100% 포함되어 크롤러에 신속하게 수집됩니다.</li>
              <li><strong>전 세계 균일한 초고속 성능</strong>: 지리적 거리에 상관없이 사용자와 가장 가까운 CDN 엣지 캐시에서 상품 페이지가 전송됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>패션/가전/도서 등 수만 종의 표준 이커머스 상품 카탈로그</li>
              <li>자동차/부동산 매물 정보 및 상세 제원 비교 페이지</li>
              <li>영화/공연/도서 리뷰 데이터베이스 포털</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>빌드 시간 관리</strong>: 상품 수가 수십만 개에 달할 경우 전체 빌드 시간이 길어질 수 있으므로, 상위 인기 상품만 <code>generateStaticParams</code>로 사전 생성하고 나머지는 온디맨드 ISR로 분기하는 전략이 실무에서 권장됩니다.</li>
              <li><strong>실시간 재고 표시 분기</strong>: 가격과 상세 설명은 정적 HTML로 서빙하고, 실시간 잔여 재고나 구매 버튼 상태는 SWR/클라이언트 패칭으로 동적 결합하는 하이브리드 아키텍처가 효과적입니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
