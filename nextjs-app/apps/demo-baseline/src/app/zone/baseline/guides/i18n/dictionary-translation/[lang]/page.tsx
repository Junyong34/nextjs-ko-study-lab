import { notFound } from 'next/navigation'
import { LOCALES } from '../locales'
import { flattenDictionary, getDictionary, hasLocale } from '../dictionaries'
import { ProductCard } from '../components/ProductCard'

/**
 * 지원 언어 목록을 알려주면 next build가 언어마다 이 page를 실행해 HTML을 만든다(라우트 표의 ●).
 * 목록 밖 lang(예: fr)은 요청 시 렌더링되지만 아래 hasLocale 검사에서 404로 끝난다.
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export default async function LocalizedProductPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  // 사전이 없는 언어는 런타임 오류 대신 404. 이 검사가 lang을 Locale 타입으로 좁힌다.
  if (!hasLocale(lang)) notFound()

  // 요청된 언어의 JSON만 동적 import한다. 이 코드는 서버에서만 실행되고 결과 HTML만 브라우저로 간다.
  const dict = await getDictionary(lang)

  return <ProductCard lang={lang} dict={dict} keyCount={flattenDictionary(dict).length} />
}
