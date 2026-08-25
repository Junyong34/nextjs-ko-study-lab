import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CacheKeyCompareDemo } from './components/CacheKeyCompareDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Cache Components 복합 인자 캐시 키 자동 직렬화"}
        concept={"Next.js 16 'use cache'는 함수의 매개변수(SKU, 통화, 회원등급)를 자동 분석하여 고유 SHA 캐시 키를 생성하므로 수동 키 배열 조합으로 인한 키 충돌 버그를 방지합니다."}
        steps={[
          {
            step: 1,
            title: "선택 SKU, 통화(KRW), 회원등급(VIP) 옵션 확인",
            description: "복합 캐시 키를 구성하는 3가지 파라미터 조합의 초기 상태를 점검합니다.",
            actionBadge: "파라미터 점검",
          },
          {
            step: 2,
            title: "회원등급을 VVIP로 변경하거나 통화를 USD로 전환",
            description: "인자 값을 변경하여 새로운 조합의 캐시 키 생성을 유도합니다.",
            actionBadge: "인자 조합 변경",
          },
          {
            step: 3,
            title: "인자 조합별 고유 캐시 키 분기 및 캐시 분리 관찰",
            description: "동일 함수 내에서도 인자 변경에 따라 독립된 캐시 엔트리가 자동 생성·조회되는지 검증합니다.",
            actionBadge: "캐시 키 검증",
            observe: "SKU/통화/등급 파라미터 조합에 따른 고유 캐시 키 자동 생성 및 할인 금액 정확 계산 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"캐시 키 생성 방식 비교 (수동 vs 자동) 실습"}>
        <CacheKeyCompareDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
