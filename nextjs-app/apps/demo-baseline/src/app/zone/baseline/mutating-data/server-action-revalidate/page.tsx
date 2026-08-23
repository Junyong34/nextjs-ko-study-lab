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
        title="Next.js Server Action 데이터 변경 & revalidatePath 캐시 동기화"
        concept="'use server' Server Action 내부에서 데이터베이스를 갱신한 후 revalidatePath('/mutating-data/server-action-revalidate')를 호출하면 서버 캐시가 무효화되어 최신 장바구니 상태가 화면과 동기화됩니다."
        steps={[
          {
            step: 1,
            title: '수량 조절 [-] / [+] 버튼 클릭',
            description: '장바구니 테이블에서 특정 품목의 수량을 늘리거나 줄여 Server Action을 실행합니다.',
            actionBadge: '수량 갱신',
          },
          {
            step: 2,
            title: '[장바구니 초기화] 클릭',
            description: '[장바구니 초기화] 버튼을 눌러 서버 상태 초기화 및 revalidatePath 동작을 실행합니다.',
            actionBadge: '초기화',
          },
          {
            step: 3,
            title: 'revalidatePath 동기화 결과 관찰',
            description: '별도의 클라이언트 새로고침 없이 합계 금액과 품목 수가 서버의 최신 상태로 즉시 동기화되는 것을 관찰합니다.',
            actionBadge: '캐시 동기화',
            observe: '장바구니 총 결제 금액과 품목 수가 revalidatePath에 의해 서버 최신 데이터로 즉시 동기화됨',
            observeAt: 'playground',
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
