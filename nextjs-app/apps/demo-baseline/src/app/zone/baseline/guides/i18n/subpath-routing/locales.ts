/** 서버·클라이언트가 함께 쓰는 로케일 목록과 경로 헬퍼. 번역 문자열은 dictionaries.ts(서버 전용)에만 둔다. */
export const BASE_PATH = '/zone/baseline/guides/i18n/subpath-routing'

export const LOCALES = ['ko', 'en', 'ja'] as const
export type Locale = (typeof LOCALES)[number]

/** 지원하지 않는 언어. [lang] 라우트에서 404가 되어야 한다. */
export const UNSUPPORTED_LANG = 'fr'

export const hasLocale = (lang: string): lang is Locale => (LOCALES as readonly string[]).includes(lang)

export const productsHref = (lang: string) => `${BASE_PATH}/${lang}/products`
export const productHref = (lang: string, id: string) => `${BASE_PATH}/${lang}/products/${id}`

/** pathname에서 BASE_PATH 다음 첫 세그먼트(= [lang] 값)를 꺼낸다. 언어 세그먼트가 없으면 null. */
export function langFromPathname(pathname: string): string | null {
  const idx = pathname.indexOf(BASE_PATH)
  const rest = idx >= 0 ? pathname.slice(idx + BASE_PATH.length) : pathname
  return rest.split('/').filter(Boolean)[0] ?? null
}
