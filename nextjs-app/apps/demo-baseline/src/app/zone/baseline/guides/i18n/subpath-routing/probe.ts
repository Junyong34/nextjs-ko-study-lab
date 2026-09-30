import { LOCALES, UNSUPPORTED_LANG, productsHref } from './locales'
import type { RouteCheck } from './types'

const attr = (html: string, name: string) => html.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? null
const heading = (html: string) => html.match(/<h3[^>]*data-products-heading[^>]*>([^<]*)</)?.[1] ?? null

/** 실제 HTTP 요청으로 각 [lang] 경로의 상태 코드와 서버 렌더링 결과를 읽는다. 응답을 흉내 내지 않는다. */
export async function checkLang(lang: string): Promise<RouteCheck> {
  const supported = (LOCALES as readonly string[]).includes(lang)
  const res = await fetch(productsHref(lang), { cache: 'no-store' })
  const html = await res.text()
  const renderedLang = attr(html, 'data-route-lang')
  const h = heading(html)
  const expectedStatus = supported ? 200 : 404
  const ok = supported ? res.status === 200 && renderedLang === lang && !!h : res.status === 404 && renderedLang === null
  return { lang, expectedStatus, status: res.status, renderedLang, heading: h, ok }
}

export const runProbe = () => Promise.all([...LOCALES, UNSUPPORTED_LANG].map(checkLang))
