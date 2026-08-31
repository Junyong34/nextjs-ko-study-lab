'use client'

import React, { useState } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { WishlistButtonClient } from './WishlistButtonClient'
import { VerificationFooter } from './VerificationFooter'

interface CompositionInteractiveSectionProps {
  productId: string
  productName: string
  productPrice: number
  children: React.ReactNode
}

export function CompositionInteractiveSection({
  productId,
  productName,
  productPrice,
  children,
}: CompositionInteractiveSectionProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(142)

  const handleToggle = (nextLiked: boolean, nextLikes: number) => {
    setLiked(nextLiked)
    setLikes(nextLikes)
  }

  return (
    <div className="space-y-6">
      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="상품 상세 뷰 (RSC 본문 + RCC 찜 버튼 합성)" className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {productName}
            </h3>
            <div className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {productPrice.toLocaleString()}원
            </div>
          </div>
          <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Server-Client Hybrid View
          </span>
        </div>

        {/* 1) Server Component: 서버에서만 렌더링되는 상세 제원 */}
        {children}

        {/* 2) Client Component: 클라이언트에서 Hydrate되는 위시리스트 버튼 */}
        <WishlistButtonClient
          productId={productId}
          initialLikes={142}
          onToggle={handleToggle}
        />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter liked={liked} likes={likes} specsCount={6} />
    </div>
  )
}
