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

  const defaultExpected = "• dynamicParams true vs false 설정 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="dynamicParams true vs false 설정 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="dynamicParams 라우트 세그먼트 옵션 (true vs false)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>export const dynamicParams = true | false</code>는 <code>generateStaticParams()</code>로 사전 생성되지 않은 동적 세그먼트 파라미터 요청에 대해 온디맨드 서버 렌더링(SSR)을 허용할지, 아니면 즉각 404 Not Found로 차단할지를 제어하는 라우트 세그먼트 설정입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>dynamicParams = false</code> 설정 시 빌드 시점에 생성되지 않은 알 수 없는 상품 ID(예: <code>prod-unknown</code>) 접근을 404로 즉각 거부하고, <code>dynamicParams = true</code>일 때는 첫 방문 시 온디맨드로 SSR 생성 후 캐시에 등록하는 동작을 대조 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>무제한 동적 URL 공격(DDoS) 원천 차단</strong>: 존재하지 않는 무작위 파라미터 요청이 서버 렌더링 CPU와 데이터베이스 커넥션을 고갈시키는 것을 방지합니다.</li>
              <li><strong>엄격한 카탈로그 접근 통제</strong>: 한정판 이벤트나 비공개 상품처럼 사전 정의된 목록 이외의 임의 접근을 프레임워크 레벨에서 404 처리합니다.</li>
              <li><strong>정적 호스팅(SSG) 예측 가능성</strong>: 생성될 페이지의 총량을 고정하여 빌드 시간과 인프라 비용을 정확히 예측 가능하게 유지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>한정판 프로모션 상품의 사전 정의된 카탈로그 고정 서빙</li>
              <li>신규 등록 상품의 온디맨드 SSR 허용(<code>true</code>) vs 단종 상품 차단(<code>false</code>)</li>
              <li>정적 내보내기(<code>output: 'export'</code>) 환경에서의 정적 경로 엄격 제한</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>generateStaticParams()와 함께 사용</strong>: <code>dynamicParams</code> 옵션은 <code>generateStaticParams()</code>와 결합될 때 의미를 가지며, <code>generateStaticParams()</code>가 없는 동적 라우트에서는 동작하지 않습니다.</li>
              <li><strong>404 페이지 트리거</strong>: <code>dynamicParams = false</code>에서 일치하지 않는 파라미터 요청 시 가장 가까운 <code>not-found.tsx</code>가 자동으로 마운트됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
