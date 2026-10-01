'use client'

import Link from 'next/link'
import { productPath, type Product } from '../data'
import { useProbeContext } from './ProbeContext'

const PROP_BY_MODE = { auto: undefined, true: true, false: false } as const
const LABEL_BY_MODE = { auto: '<Link href=…>', true: '<Link href=… prefetch>', false: '<Link href=… prefetch={false}>' } as const

export function ProductLink({ product }: { product: Product }) {
  const { recordHover } = useProbeContext()
  return (
    <Link
      href={productPath(product.id)}
      prefetch={PROP_BY_MODE[product.linkMode]}
      onMouseEnter={() => recordHover(`상품 ${product.id} 카드 hover`)}
      className="block rounded-md border border-zinc-300 bg-white p-3 text-xs transition hover:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <span className="block font-bold text-zinc-900 dark:text-zinc-100">{product.name}</span>
      <span className="mt-1 block text-zinc-600 dark:text-zinc-400">{product.price.toLocaleString('ko-KR')}원</span>
      <code className="mt-2 block rounded bg-zinc-100 px-1.5 py-1 text-[10px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        {LABEL_BY_MODE[product.linkMode]}
      </code>
    </Link>
  )
}
