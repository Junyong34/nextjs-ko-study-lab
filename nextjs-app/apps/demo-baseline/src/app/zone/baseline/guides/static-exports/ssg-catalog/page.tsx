import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SsgCatalogDemo } from './components/SsgCatalogDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"generateStaticParams를 통한 대규모 SSG 카탈로그 사전 빌드"}
        concept={"generateStaticParams() 함수로 수천 개의 상품 ID 목록을 반환하여 빌드 타임에 모든 상품 상세 페이지를 완전한 정적 HTML로 사전 생성(SSG)하여 CDN 에지 0ms 응답을 달성합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 사전 빌드 품목 확인",
            description: "빌드 시점에 generateStaticParams로 생성된 정적 상품 목록을 점검합니다.",
            actionBadge: "SSG 품목 확인",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 주문 파라미터 구성",
            description: "사전 생성된 정적 HTML 위에서 클라이언트 상호작용을 실행합니다.",
            actionBadge: "수량 조절",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 SSG 주문 액션 테스트",
            description: "정적 페이지에서 외부 API로의 통신 트리거를 확인합니다.",
            actionBadge: "주문 액션 실행",
          },
          {
            step: 4,
            title: "빌드 타임 사전 생성 HTML의 0ms 즉각 서빙 관찰",
            description: "서버 렌더링 연산 없이 CDN 캐시에서 즉시 반환되는 초고속 응답 성능을 검증합니다.",
            actionBadge: "SSG 성능 검증",
            observe: "generateStaticParams 사전 빌드를 통한 정적 상품 카탈로그의 0ms 즉각 로딩 결과 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"정적 HTML 카탈로그 사전 생성 실습"}>
        <SsgCatalogDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
