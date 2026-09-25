/**
 * 클라이언트·서버가 함께 쓰는 로케일 "목록"만 둔다. 번역 문자열은 여기 두지 않는다.
 * 이 파일은 LangNav(클라이언트)도 import하므로, 여기 적은 값은 전부 JS 청크에 실린다.
 */
export const BASE_PATH = '/zone/baseline/guides/i18n/dictionary-translation'

export const LOCALES = ['ko', 'en', 'ja'] as const
export type Locale = (typeof LOCALES)[number]

/** 사전 파일이 없는 언어. [lang] 라우트에서 404가 되어야 한다. */
export const UNSUPPORTED_LANG = 'fr'

export const pageHref = (lang: string) => `${BASE_PATH}/${lang}`
/** 검증 전용 Route Handler. 사전 원본 JSON을 요청 시에만 내려준다(클라이언트 번들 아님). */
export const sourceHref = (lang: string) => `${BASE_PATH}/source/${lang}`
