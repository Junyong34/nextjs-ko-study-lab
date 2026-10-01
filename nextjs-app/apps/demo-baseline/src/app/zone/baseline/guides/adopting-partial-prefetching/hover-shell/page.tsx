import { PRODUCTS } from './data'
import { ProductLink } from './components/ProductLink'

// 목록 라우트: 상품 카드마다 실제 <Link>를 둔다. 링크 prefetch prop이 카드마다 다르다.
export default function ProductListPage() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        카드는 모두 <code>/products/[id]</code> 라우트로 연결되는 실제 <code>&lt;Link&gt;</code>입니다.
      </p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {PRODUCTS.map((p) => (
          <li key={p.id}>
            <ProductLink product={p} />
          </li>
        ))}
      </ul>
    </div>
  )
}
