'use client'
import React, { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { BffAggregationDemo } from './components/BffAggregationDemo'
import { VerificationFooter } from './components/VerificationFooter'

interface AggregatedResult {
  order: { orderId: string; status: string }
  inventory: { warehouse: string; remaining: number }
  shipping: { courier: string; status: string }
  elapsedMs: number
}

export default function DemoPage() {
  const [result, setResult] = useState<AggregatedResult | null>(null)

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"BFF(Backend-for-Frontend) 마이크로서비스 주문 데이터 병렬 통합"}
        concept={"Next.js Route Handler(/api/bff/order)에서 주문 서비스, 회원 서비스, 배송 서비스를 Promise.all()로 병렬 호출하여 클라이언트를 위한 단일 최적화 JSON으로 통합 반환합니다."}
        steps={[
          {
            step: 1,
            title: "BFF 통합 전 마이크로서비스 개별 호출 오버헤드 점검",
            description: "클라이언트가 3개 API를 순차 호출할 때 발생하는 네트워크 왕복 지연을 확인합니다.",
            actionBadge: "구조 분석",
          },
          {
            step: 2,
            title: "[BFF 통합 주문 조회 API 호출 (/api/bff/order)] 버튼 클릭",
            description: "서버 측 BFF 엔드포인트를 호출하여 내부 MSA 서비스 병렬 집계를 수행합니다.",
            actionBadge: "BFF 호출",
          },
          {
            step: 3,
            title: "단일 응답 JSON으로 통합된 주문·회원·배송 데이터 관찰",
            description: "네트워크 요청 1회만으로 화면 렌더링에 필요한 모든 집계 데이터가 즉시 수신되는지 검증합니다.",
            actionBadge: "집계 결과 검증",
            observe: "BFF API 호출을 통한 3개 MSA 응답(주문/회원/배송)의 단일 최적화 페이로드 집계 수신 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Route Handler를 통한 레거시 주문/재고 API 취합 (BFF) 실습"}>
        <BffAggregationDemo onResult={setResult} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={result ? result.elapsedMs < 550 : undefined}
        actual={result ? `- orderId: ${result.order.orderId}\n- Promise.all 병렬 실행 소요 시간: ${result.elapsedMs}ms\n- (순차 호출이었다면 약 550ms 이상 소요)` : undefined}
        expected="Route Handler가 실제 fetch 1회로 3개 서비스를 Promise.all 병렬 호출해, 순차 합산(약 550ms)보다 훨씬 짧은 시간에 응답해야 한다."
      />
    </DemoContainer>
  )
}
