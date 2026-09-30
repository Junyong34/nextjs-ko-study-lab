import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasLocale, productHref } from '../../locales'
import { PRODUCT_IDS, formatPrice, getDictionary } from '../../dictionaries'

export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  // Next.js 16에서 params는 Promise다. 반드시 await 한다.
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100" data-products-heading>
        {dict.heading}
      </h3>
      <ul className="space-y-2">
        {PRODUCT_IDS.map((id) => (
          <li
            key={id}
            className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <Link href={productHref(lang, id)} className="text-xs font-medium underline-offset-2 hover:underline">
              {dict.products[id]}
            </Link>
            <span className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400">{formatPrice(lang, dict.prices[id])}</span>
            <span className="rounded bg-zinc-900 px-2 py-1 text-[10px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
              {dict.addToCart}
            </span>
          </li>
        ))}
      </ul>
      <p className="font-mono text-[10px] text-zinc-500">params.lang = &quot;{lang}&quot; · 서버 렌더링 결과</p>
    </section>
  )
}
