'use client'

import { useEffect } from 'react'

interface Product {
  id: string
  name: string
  price: number
}

interface MemoizedProductGridProps {
  products: Product[]
  quantity: number
}

let renderCount = 0

export function MemoizedProductGrid({ products, quantity }: MemoizedProductGridProps) {
  useEffect(() => {
    renderCount += 1
    console.log(`[React Compiler 데모] MemoizedProductGrid 렌더 횟수: ${renderCount}`)
  })

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-zinc-500">
        콘솔에 <code>MemoizedProductGrid 렌더 횟수</code> 로그가 몇 번 찍히는지 확인하세요. [상품 목록과 무관한 상태 변경]을 눌러도 이 컴포넌트의 props(products, quantity)가 그대로면 로그 줄이 추가되지 않아야 합니다 — 부모가 재렌더링돼도 컴파일러가 메모이즈한 JSX를 그대로 재사용해 이 하위 트리를 건너뛰었다는 뜻입니다.
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-md border border-zinc-200 p-3 text-xs dark:border-zinc-800">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{product.name}</h3>
            <p className="mt-1 text-zinc-500">{product.price.toLocaleString('ko-KR')}원 × {quantity}</p>
            <p className="mt-2 font-mono font-semibold">{(product.price * quantity).toLocaleString('ko-KR')}원</p>
          </article>
        ))}
        {products.length === 0 ? <p className="text-xs text-zinc-500">일치하는 상품이 없습니다.</p> : null}
      </div>
    </div>
  )
}
