import React from 'react'
import { ProductSeedProvider } from './components/ProductSeedProvider'

/**
 * children(목록 또는 정식 상세)과 modal 슬롯(@modal)을 나란히 둔다.
 * Provider는 이 layout에 있어서 목록 → 모달로 앱 안에서 이동(소프트 내비게이션)할 때도
 * 사라지지 않는다 — 카드에서 꺼내 둔 요약을 모달이 이어서 쓸 수 있는 이유다.
 */
export default function ProductDetailLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <ProductSeedProvider>
      <div className="relative">
        {children}
        {modal}
      </div>
    </ProductSeedProvider>
  )
}
