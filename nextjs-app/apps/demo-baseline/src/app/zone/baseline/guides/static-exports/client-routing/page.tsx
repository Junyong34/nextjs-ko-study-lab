import { PRODUCTS } from './lib/products'

// 목록 화면(children). 상세로의 이동은 레이아웃의 <Link>가 담당한다.
export default function ProductListPage() {
  return (
    <div data-screen="list" className="space-y-1 rounded border border-zinc-200 p-3 text-xs dark:border-zinc-800">
      <p className="text-[11px] text-zinc-500">client-routing/page.tsx</p>
      <h4 className="text-sm font-bold">상품 목록</h4>
      <ul className="list-disc pl-4">
        {PRODUCTS.map((product) => (
          <li key={product.id}>{product.name} · {product.price}</li>
        ))}
      </ul>
    </div>
  )
}
