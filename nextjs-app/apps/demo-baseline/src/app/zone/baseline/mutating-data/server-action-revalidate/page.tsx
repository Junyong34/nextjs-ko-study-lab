import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { CartTableClient } from './components/CartTableClient'
import { getCartSummary } from './actions'

export default async function ServerActionRevalidateDemoPage() {
  const cart = await getCartSummary()

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js Server Action 데이터 변경 & revalidatePath 캐시 동기화"
        concept="'use server' Server Action 내부에서 데이터베이스를 갱신한 후 revalidatePath('/mutating-data/server-action-revalidate')를 호출하면 서버 캐시가 무효화되어 최신 장바구니 상태가 화면과 동기화됩니다."
        steps={[
          {
                    "step": 1,
                    "title": "[+] 수량 증가 버튼 클릭",
                    "description": "장바구니 수량 증가 Server Action을 실행하여 수량을 1 올립니다.",
                    "actionBadge": "수량 증가"
          },
          {
                    "step": 2,
                    "title": "[-] 수량 감소 버튼 클릭",
                    "description": "수량 감소 Action을 실행하여 총 결제 금액이 재계산되는지 확인합니다.",
                    "actionBadge": "수량 감소"
          },
          {
                    "step": 3,
                    "title": "[장바구니 초기화] 클릭",
                    "description": "장바구니 내역을 전체 리셋하여 초기 상태로 되돌립니다.",
                    "actionBadge": "초기화"
          },
          {
            step: 4,
            title: "서버 캐시 revalidation 및 총액 갱신 관찰",
            description: "revalidatePath 호출로 서버 데이터 캐시가 갱신되어 최신 장바구니 합계가 렌더링되는지 관찰합니다.",
            actionBadge: "캐시 revalidation",
            observe: "Server Action 실행 후 revalidatePath에 의해 장바구니 수량과 총 결제 금액이 즉시 동기화됨",
            observeAt: "playground",
          },
        ]}
      />

      {/* 2단, 3단, 4단: 실습 조작 영역 및 검증/개념정리 */}
      <CartTableClient cart={cart} />
    </DemoContainer>
  )
}
