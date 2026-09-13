import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'directives/use-server/inline-action-closure')

import { DemoContainer, DemoGuideCard, MOCK_PRODUCTS } from '@study/demo-kit'
import { InlineActionClosureDemo } from './components/InlineActionClosureDemo'
import type { OrderResult, ProductBuyItem } from './types'

export default async function DemoPage() {
  // 이 컴포넌트는 Server Component다. .map() 순회마다 buyProductAction이
  // product 하나씩을 클로저로 캡처하며 별도의 인라인 'use server' 함수로 컴파일된다.
  const items: ProductBuyItem[] = MOCK_PRODUCTS.slice(0, 3).map((product) => {
    async function buyProductAction(): Promise<OrderResult> {
      'use server'
      // product.id / product.name / product.price는 인자로 전달받은 값이 아니라
      // 상위(Server Component) 스코프에서 클로저로 캡처된 값이다.
      await new Promise((resolve) => setTimeout(resolve, 400))
      return {
        orderNo: `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        productId: product.id,
        productName: product.name,
        price: product.price,
        processedAt: new Date().toISOString(),
      }
    }
    return { product, buyAction: buyProductAction }
  })

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use server' 함수 인라인 클로저 Server Action"}
        concept={"서버 컴포넌트 함수 본문 내부에서 async function buyProductAction() { 'use server'; ... } 형태로 선언하면, 상품 목록을 순회하며 각 상품의 productId·price를 클로저로 자동 캡처한 별도의 Server Action이 상품마다 하나씩 생성되어 Client Component에 prop으로 전달됩니다."}
        steps={[
          {
            step: 1,
            title: '구매 대상 상품 카드 선택',
            description: '상품마다 서로 다른 클로저를 캡처한 인라인 Server Action 중 하나를 선택합니다.',
            actionBadge: '상품 선택',
          },
          {
            step: 2,
            title: "[원클릭 즉시 구매] 클릭",
            description: "선택한 상품의 클로저가 캡처한 productId·price를 담아 컴파일된 Server Action RPC를 실제로 호출합니다.",
            actionBadge: '즉시 구매',
          },
          {
            step: 3,
            title: '클로저 캡처값과 서버 응답 일치 확인',
            description: "클라이언트가 보낸 적 없는 productId·price가 서버 응답에 그대로 나타나는지, Network 탭의 POST 요청(Next-Action 헤더)으로도 실제 RPC인지 확인합니다.",
            actionBadge: '주문 완료',
            observe: '즉시 구매 후 3단 검증 패널에서 클로저 캡처값(Expected)과 서버 응답(Actual) 일치 확인',
            observeAt: 'verification',
          },
        ]}
      />
      <InlineActionClosureDemo items={items} />
    </DemoContainer>
  )
}
