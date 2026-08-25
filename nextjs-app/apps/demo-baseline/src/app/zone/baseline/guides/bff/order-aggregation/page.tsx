import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { BffAggregationDemo } from './components/BffAggregationDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
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
        <BffAggregationDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
