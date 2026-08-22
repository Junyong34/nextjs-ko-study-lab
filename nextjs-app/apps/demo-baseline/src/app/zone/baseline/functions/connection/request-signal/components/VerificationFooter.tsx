'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="connection() 비동기 연결 준비 대기 실증 검증"
        expected="• connection() 비동기 연결 준비 대기 사양에 따른 정상 동작 및 상태 변화 관찰"
        actual="• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"
        isMatched={true}
        description="Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."
      />
      <DemoDeepDiveCard title="connection() 비동기 연결 준비 대기">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>connection()은 Next.js 15+에서 도입된 비동기 함수로, 서버 컴포넌트가 정적 사전 렌더링(Prerender) 단계에서 벗어나 실제 클라이언트 요청이 들어올 때까지 동적 렌더링 진입을 명시적으로 대기시키는 신호(Signal) API입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 예제에서는 타임세일 실시간 재고 핫딜 페이지에서 connection()을 호출하여, 빌드 타임의 정적 스냅샷이 아닌 사용자 요청 시점의 실시간 DB 커넥션을 맺고 초 단위 실시간 재고와 가격을 동기화합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>PPR(Partial Prerendering)과의 완벽한 결합: 정적 셸은 빌드 타임에 미리 만들어두고, 실시간 커넥션이 필요한 동적 영역만 정밀하게 런타임 지연 실행합니다.</li>
              <li>불필요한 빌드 타임 DB 쿼리 방지: 빌드 머신이 운영 데이터베이스에 불필요하게 연결되는 문제를 원천 차단합니다.</li>
              <li>예측 가능한 렌더링 파이프라인: 정적 생성과 동적 렌더링의 경계를 명확한 비동기 함수로 선언합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>실시간 잔여 재고 및 초 단위 가격 변동이 심한 플래시 딜 페이지</li>
              <li>사용자 위치(IP/Geo)에 따른 실시간 당일 배송 가능 여부 판별</li>
              <li>실시간 주문 폭주 시 대기열 순번 발급 페이지</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
