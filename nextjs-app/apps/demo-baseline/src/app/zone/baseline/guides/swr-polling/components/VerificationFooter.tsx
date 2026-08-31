'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { DeliveryStatus } from '../types'

export interface VerificationFooterProps {
  deliveryData?: DeliveryStatus | null
  isAutoPolling?: boolean
  pollCount?: number
  hasInteracted?: boolean
}

export function VerificationFooter({
  deliveryData = null,
  isAutoPolling = true,
  pollCount = 1,
  hasInteracted = false,
}: VerificationFooterProps) {
  const isMatched =
    hasInteracted && pollCount >= 2
      ? true
      : undefined

  const expected =
    '• SWR refreshInterval(2500ms) 주기적 HTTP 폴링 및 배송 단계(STEP 1~4) 자동 전이\n• mutate() 온디맨드 즉시 갱신 시 최신 배송 상태 동기화'

  const actual =
    !hasInteracted || !deliveryData || pollCount <= 1
      ? '• 폴링 대기 중 (초기 배송 상태: STEP 1 결제 완료, 운송장: #TRK-2026-8831)'
      : `• SWR 폴링 모드: ${isAutoPolling ? '자동 폴링 활성 (2.5초 주기)' : '일시 정지'}\n• 누적 수신 횟수: ${pollCount}회 (최근 수신: ${deliveryData.updatedAt})\n• 현재 배송 단계: [${deliveryData.statusLabel}] - ${deliveryData.currentLocation}`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="SWR 실시간 배송 조회 자동 폴링 & mutate() 갱신 실증 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="SWR의 refreshInterval(2500ms) 백그라운드 폴링과 mutate() 온디맨드 재검증 동작을 실시간 검증합니다."
      />
      <DemoDeepDiveCard title="SWR 실시간 배송 조회 자동 폴링 & mutate() 갱신">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              SWR(Stale-While-Revalidate)의 <code>refreshInterval</code> 옵션은 클라이언트 사이드에서 지정된 주기(2500ms)마다 백그라운드 HTTP 폴링을 실행하여 데이터를 최신화하고, 탭 포커스(<code>revalidateOnFocus</code>) 및 네트워크 재연결 시 즉시 재검증을 수행하는 실시간 클라이언트 데이터 페칭 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 실시간 택배 배송 트래킹 화면에서 2.5초 주기로 배송 기사 위치와 상태(결제 완료 → 상품 포장 중 → 간선 배송 중 → 배송 완료)를 자동 폴링하고, [mutate() 즉시 수동 갱신] 버튼 클릭 시 <code>mutate()</code>를 호출하여 폴링 주기와 무관하게 즉각 최신 상태를 반영하는 흐름을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>자동 백그라운드 동기화</strong>: 별도의 복잡한 WebSocket 서버 인프라 구축 없이 표준 HTTP 엔드포인트만으로 실시간성 UI를 구현합니다.</li>
              <li><strong>지능형 자원 절약</strong>: 사용자가 다른 브라우저 탭으로 전환하거나 화면을 최소화하면 폴링을 자동으로 일시 중단하여 불필요한 배터리와 트래픽 소모를 방지합니다.</li>
              <li><strong>강력한 내장 캐시</strong>: 이전 요청 데이터를 로컬 메모리에 보존하여 재검증 중에도 깜빡임 없는 매끄러운 뷰를 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>배달 음식 주문 후 라이더 위치 및 도착 예정 시간 실시간 트래킹</li>
              <li>주식/가상자산 거래소의 실시간 시세 및 호가창 자동 업데이트</li>
              <li>고객센터 상담 대기 인원 수 및 티켓 처리 현황 모니터링</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>폴링 주기 최적화</strong>: 너무 짧은 폴링 주기(e.g. 500ms)는 서버 API 게이트웨이에 심각한 트래픽 부하를 유발하므로 실무 요구사항에 맞는 적절한 간격(2~10초)을 설정해야 합니다.</li>
              <li><strong>Server Actions와의 역할 분담</strong>: 초기 화면 렌더링은 Server Component로 처리하고, 이후의 주기적 실시간 갱신 영역만 SWR을 적용하는 하이브리드 구성이 권장됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
