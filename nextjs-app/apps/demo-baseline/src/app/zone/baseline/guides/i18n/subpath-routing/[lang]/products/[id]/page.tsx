import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasLocale, productsHref } from '../../../locales'
import { PRODUCT_IDS, formatPrice, getDictionary } from '../../../dictionaries'

/** 부모 [lang]의 params와 조합되어 /ko/products/101 같은 경로가 빌드 때 만들어진다. */
export function generateStaticParams() {
  return PRODUCT_IDS.map((id) => ({ id }))
}

export default async function ProductDetailPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params
  if (!hasLocale(lang)) notFound()
  if (!(PRODUCT_IDS as readonly string[]).includes(id)) notFound()
  const key = id as (typeof PRODUCT_IDS)[number]
  const dict = await getDictionary(lang)

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100" data-products-heading>
        {dict.products[key]}
      </h3>
      <p className="font-mono text-xs">{formatPrice(lang, dict.prices[key])}</p>
      <p className="font-mono text-[10px] text-zinc-500">
        params = {'{'} lang: &quot;{lang}&quot;, id: &quot;{id}&quot; {'}'}
      </p>
      <Link href={productsHref(lang)} className="inline-block text-[11px] underline underline-offset-2">
        {dict.back}
      </Link>
    </section>
  )
}
