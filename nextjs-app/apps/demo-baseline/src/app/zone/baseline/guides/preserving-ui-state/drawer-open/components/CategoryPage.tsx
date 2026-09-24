import { MOCK_PRODUCTS, type Product } from '@study/demo-kit'
import { CartDrawer } from './CartDrawer'

/**
 * 각 카테고리 page.tsx가 렌더링하는 본문. Server Component이며,
 * 이 안의 CartDrawer(slot="page")는 page 세그먼트가 소유한다.
 */
export function CategoryPage({ category, label }: { category: Product['category']; label: string }) {
  const products = MOCK_PRODUCTS.filter((product) => product.category === category)
  return (
    <section aria-label={`${label} 카테고리`} className="min-w-0 space-y-3">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{label} 카테고리 (page.tsx)</h3>
      <CartDrawer slot="page" />
      <ul className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
        {products.map((product) => (
          <li
            key={product.id}
            className="rounded-lg border border-zinc-200 p-3 text-xs dark:border-zinc-800"
          >
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{product.name}</p>
            <p className="mt-0.5 font-mono text-zinc-500">{product.price.toLocaleString('ko-KR')}원</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
