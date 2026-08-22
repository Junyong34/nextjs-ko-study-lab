import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CartTableClient } from './components/CartTableClient'
import { VerificationFooter } from './components/VerificationFooter'
import { getCartSummary } from './actions'

export default async function ServerActionRevalidateDemoPage() {
  const cart = await getCartSummary()

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Server Action 데이터 변경 & revalidatePath 동기화"
        concept="클라이언트에서 Server Action을 호출하여 서버 장바구니 데이터를 수정한 뒤 revalidatePath()를 실행하면, 별도의 추가 GET 요청 없이 단 1번의 서버 라운드트립으로 최신 서버 데이터가 화면에 즉시 동기화됩니다."
        steps={[
          {
            step: 1,
            title: '장바구니 수량 [+] 또는 [-] 클릭',
            description: '테이블에서 특정 상품의 수량을 변경하여 Server Action을 호출합니다.',
            actionBadge: 'Server Action 호출',
          },
          {
            step: 2,
            title: 'revalidatePath 자동 실행',
            description: '서버에서 수량이 업데이트되고 revalidatePath()가 캐시를 무효화합니다.',
            actionBadge: '서버 캐시 무효화',
          },
          {
            step: 3,
            title: '서버 총액 자동 동기화 확인',
            description: '하단 총 결제 금액과 품목 수가 서버 계산 결과로 즉시 일치하는 것을 확인합니다.',
            actionBadge: '단일 라운드트립 완료',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="이커머스 장바구니 수량 변경 및 실시간 결제액 동기화" className="space-y-4">
        <CartTableClient cart={cart} />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
