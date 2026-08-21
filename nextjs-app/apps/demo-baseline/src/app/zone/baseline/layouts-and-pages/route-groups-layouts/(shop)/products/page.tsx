import React from 'react'

export default function ShopProductsPage() {
  return (
    <div className="rounded border border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
        상점 상품 카탈로그 페이지 (URL: /products)
      </h3>
      <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
        (shop) 그룹의 레이아웃(헤더, 프로모션 공지 배너, 장바구니 GNB)이 입혀진 화면입니다.
      </p>
    </div>
  )
}
