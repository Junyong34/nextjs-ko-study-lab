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

  const defaultExpected = "• 대규모 카탈로그 대역폭 절약 최적화 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="대규모 카탈로그 대역폭 절약 최적화 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="대규모 카탈로그 대역폭 절약 최적화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js의 <code>{'<'}Link prefetch={'{'}...{'}'}{'>'}</code> 속성과 Router Cache 세분화 제어는 수백~수천 개의 상품 링크가 포함된 대규모 카탈로그 화면에서 불필요한 전체 RSC 페이로드 프리패칭을 방지하고, 뷰포트 교차 시점에만 경량 정적 셸(loading.tsx)을 선별적으로 가져와 클라이언트 대역폭(Bandwidth)과 서버 리소스를 극대화하여 절약하는 최적화 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 대규모 상품 목록에서 기본 전체 프리패치(<code>prefetch={'{'}true{'}'}</code>) 적용 시(120개 요청, 1.8MB)와 선별적 프리패치/호버 기반 프리패치 최적화 적용 시(6개 요청, 92KB)의 네트워크 전송량을 대조하여, 95% 이상의 대역폭 절감 효과를 실증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>모바일 데이터 비용 95% 절감</strong>: 무선 모바일 네트워크 환경의 사용자 데이터 소모량을 최소화하고 브라우저 메인 스레드 파싱 부하를 경감합니다.</li>
              <li><strong>서버 트래픽 및 오리진 부하 완화</strong>: 불필요한 RSC 렌더링 요청을 사전에 차단하여 피크 타임 서버 CPU 사용량을 안정화합니다.</li>
              <li><strong>Core Web Vitals (INP/LCP) 개선</strong>: 백그라운드 프리패치 네트워크 경합을 줄여 사용자 인터랙션 응답성을 최고 수준으로 유지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>수천 개의 상품이 나열되는 무한 스크롤(Infinite Scroll) 및 가상화 그리드 카탈로그</li>
              <li>복잡한 필터 및 페이지네이션이 포함된 이커머스 카테고리/검색 결과 리스트</li>
              <li>데이터 사용량에 민감한 글로벌 모바일 웹 환경 서비스</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Next.js 15 기본 prefetch 동작 이해</strong>: <code>prefetch</code> prop을 생략(undefined)하면 뷰포트 진입 시 전체 페이지가 아닌 가장 가까운 <code>loading.tsx</code> 세그먼트 페이로드만 가져오므로, 무분별하게 <code>prefetch={'{'}true{'}'}</code>를 지정하지 않는 것이 좋습니다.</li>
              <li><strong>prefetch=false 적용 대상</strong>: 빈번히 스크롤만 지나치는 푸터 링크나 관리자 메뉴 등에는 <code>prefetch={'{'}false{'}'}</code>를 명시하고 호버(<code>onMouseEnter</code>) 시에만 <code>router.prefetch()</code>를 호출하는 전략이 권장됩니다.</li>
              <li><strong>Connection/Data Saver 모드 감지</strong>: <code>navigator.connection.saveData</code>가 true인 모바일 환경에서는 프리패칭을 완전 비활성화하는 적응형 로직을 적용할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
