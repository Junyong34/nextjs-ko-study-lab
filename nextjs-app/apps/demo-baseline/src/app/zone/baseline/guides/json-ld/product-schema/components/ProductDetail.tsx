import type { ProductRecord } from '../types'

const krw = new Intl.NumberFormat('ko-KR')

/** 화면에 보이는 상품 정보. JSON-LD와 같은 ProductRecord에서 그린다 (서버 컴포넌트). */
export function ProductDetail({ product }: { product: ProductRecord }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center gap-2 text-[10px]">
        <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          SKU {product.sku}
        </span>
        <span className="text-zinc-500 dark:text-zinc-400">{product.brand}</span>
      </div>
      <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{product.name}</h3>
      <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
        {krw.format(product.price)}원
        <span className="ml-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {product.availability === 'InStock' ? '재고 있음' : '품절'}
        </span>
      </p>
      <div className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/80 p-2.5 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
          상품 설명 (판매자 입력 · React 텍스트로 렌더되어 자동 이스케이프)
        </div>
        <p className="mt-1 break-all font-mono text-xs text-zinc-700 dark:text-zinc-300">{product.description}</p>
      </div>
    </div>
  )
}
