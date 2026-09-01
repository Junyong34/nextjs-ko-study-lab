import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PrivateCacheDemo } from './components/PrivateCacheDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getUserCartCache, type UserId } from './cachedData'

async function PrivateCacheContent({
  searchParams,
}: {
  searchParams: Promise<{ user?: string }>
}) {
  const { user } = await searchParams
  const userId: UserId = user === 'user_B' ? 'user_B' : 'user_A'
  const data = await getUserCartCache(userId)

  return (
    <>
      <DemoPlaygroundCard title={"개인화 사용자별 Private 캐시 격리 실습"}>
        <PrivateCacheDemo
          userId={data.userId}
          userName={data.userName}
          cacheKey={`private-cart:${data.userId}`}
          cacheId={data.cacheId}
          generatedAt={data.generatedAt}
          cartItems={[...data.cartItems]}
          totalAmount={data.totalAmount}
        />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(data.cacheId)}
        actual={`- userId: ${data.userId}\n- cacheId: #${data.cacheId}\n- totalAmount: ${data.totalAmount.toLocaleString()}원`}
        expected="사용자 A와 사용자 B는 서로 다른 cacheId를 가지며, 한쪽을 조회해도 다른 쪽 캐시에 영향을 주지 않는다."
      />
    </>
  )
}

export default function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ user?: string }>
}) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"사용자별 비공개 캐시(Private Cache) 격리"}
        concept={"use cache 함수 인자에 사용자 고유 식별자(userId)를 전달하여 사용자 A의 개인 장바구니/주문 내역이 사용자 B에게 유출되지 않도록 캐시 네임스페이스를 완전히 격리합니다."}
        steps={[
          {
            step: 1,
            title: "[사용자 A] 기본 활성화 상태 및 개인화 데이터 확인",
            description: "user_A로 인증된 상태에서 조회된 비공개 캐시 항목들을 점검합니다.",
            actionBadge: "사용자 A 확인",
          },
          {
            step: 2,
            title: "[사용자 B] 버튼 클릭으로 계정 전환",
            description: "다른 사용자 계정으로 전환하여 독립된 사용자 캐시 키로 조회를 요청합니다.",
            actionBadge: "사용자 전환",
          },
          {
            step: 3,
            title: "사용자 간 캐시 데이터 격리 및 데이터 오염 방지 관찰",
            description: "사용자 A의 데이터가 사용자 B 화면에 노출되지 않고 독립된 캐시가 즉시 서빙되는지 검증합니다.",
            actionBadge: "캐시 격리 검증",
            observe: "사용자 A ↔ 사용자 B 전환 시 독립된 개인 캐시 키 분기 및 데이터 상호 오염 없는 격리 렌더링 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-zinc-400 font-mono animate-pulse">
            [대기] 사용자별 캐시 데이터 로딩 중...
          </div>
        }
      >
        <PrivateCacheContent searchParams={searchParams} />
      </Suspense>
    </DemoContainer>
  )
}
