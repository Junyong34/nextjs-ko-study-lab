import React from 'react'
import { ProductCard } from '@study/demo-kit'
import type { Product } from '@study/demo-kit'

export function CategoryProductGrid({
  heading,
  description,
  products,
}: {
  heading: string
  description: string
  products: Product[]
}) {
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{heading}</h3>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
