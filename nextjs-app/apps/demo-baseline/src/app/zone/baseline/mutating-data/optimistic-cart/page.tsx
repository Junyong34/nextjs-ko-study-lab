import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { OptimisticCartClient } from './components/OptimisticCartClient'
import { VerificationFooter } from './components/VerificationFooter'
import { getServerCart } from './actions'

export default async function OptimisticCartDemoPage() {
  const initialCart = await getServerCart()

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="React 19 useOptimistic & 낙관적 장바구니 업데이트"
        concept="네트워크 지연(800ms)이 있는 환경에서도 useOptimistic을 적용하면 버튼 클릭 즉시(0ms) 장바구니 수량과 총액이 먼저 반영되며, 백그라운드 Server Action 완료 시 서버 확정 데이터로 매끄럽게 교체됩니다."
        steps={[
          {
            step: 1,
            title: '[+ 장바구니 담기] 및 [장바구니 초기화] 클릭',
            description: '상품 카드에서 [+ 장바구니 담기] 또는 [장바구니 초기화] 버튼을 클릭합니다.',
            actionBadge: '0ms 즉각 반영',
          },
          {
            step: 2,
            title: '[낙관적 렌더링] 임시 뱃지 확인',
            description: '목록에 주황색 [낙관적 렌더링] 뱃지가 표시되며 800ms 동안 백그라운드 서버 통신이 진행되는 것을 확인합니다.',
            actionBadge: 'useOptimistic',
          },
          {
            step: 3,
            title: '서버 확정 상태 전환 관찰',
            description: '800ms 후 Server Action이 완료되어 녹색 [서버 확정 완료] 뱃지와 최종 서버 동기화 상태로 전환되는 것을 관찰합니다.',
            actionBadge: '서버 확정 완료',
            observe: '0ms 시점에 주황색 [낙관적 렌더링]으로 즉시 증가한 뒤, 800ms 후 녹색 [서버 확정 완료] 상태로 전환됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="낙관적 장바구니 인터랙션 시뮬레이터" className="space-y-4">
        <OptimisticCartClient initialCart={initialCart} />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
