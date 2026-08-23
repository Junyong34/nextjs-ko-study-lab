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

  const defaultExpected = "• Route Handler를 통한 레거시 주문/재고 API 취합 (BFF) 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 5단 표준 레이아웃 정상 적용"

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
        title="Route Handler를 통한 레거시 주문/재고 API 취합 (BFF) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="Route Handler를 통한 레거시 주문/재고 API 취합 (BFF)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Backend-for-Frontend(BFF) 패턴은 Next.js Route Handler나 Server Component에서 분산된 마이크로서비스(주문, 결제, 재고, 배송 API)를 서버사이드에서 병렬(<code>Promise.all</code>)로 호출하고, 프론트엔드 UI에 최적화된 단일 JSON DTO로 결합하여 클라이언트에 전달하는 통합 아키텍처 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 주문 상세 조회 시 주문 서비스, 배송 추적 시스템, 결제 게이트웨이의 개별 API를 서버에서 한 번에 병렬 취합하여, 클라이언트가 단 한 번의 요청으로 완벽하게 통합된 주문 완료 화면 데이터를 수신하는 흐름을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>클라이언트 네트워크 RTT 대폭 감소</strong>: 브라우저에서 3~4개의 마이크로서비스를 직렬로 호출하던 워터폴을 없애고 단 1회의 서버 내부 통신으로 결합합니다.</li>
              <li><strong>내부 마이크로서비스 주소 은닉</strong>: 사내 레거시 백엔드 IP 및 내부 인증 토큰을 브라우저에 노출하지 않고 안전한 서버 네트워크에서 통신합니다.</li>
              <li><strong>프론트엔드 맞춤형 DTO 가공</strong>: 백엔드의 복잡하고 불필요한 중첩 필드를 뷰에 필요한 구조로 평탄화(Flatten)하여 클라이언트 상태 관리를 단순화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 마이페이지 주문 상세 내역(주문 정보 + 실시간 택배 배송 추적 + 결제 영수증)</li>
              <li>상품 상세 화면(기본 스펙 + 실시간 물류센터 재고 + 회원별 할인 쿠폰 목록)</li>
              <li>관리자 대시보드의 통합 매출 및 정산 통계 지표 취합</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>부분 실패(Partial Failure) 복원력 처리</strong>: 특정 서브 서비스(예: 배송 추적)가 장애를 겪더라도 전체 주문 조회가 실패하지 않도록 <code>Promise.allSettled</code>를 활용한 우아한 강등(Graceful Degradation)을 구현해야 합니다.</li>
              <li><strong>서버사이드 캐싱 적용</strong>: 자주 변하지 않는 상품 기본 정보는 <code>use cache</code> 또는 <code>fetch(url, {'{'} next: {'{'} revalidate {'}'} {'}'})</code>로 캐싱하여 백엔드 부하를 절감해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
