import 'server-only'
import type { Locale } from './locales'

/** ko.json의 모양을 기준 타입으로 삼는다. en/ja에 키가 빠지면 아래 satisfies에서 타입 오류가 난다. */
export type Dictionary = typeof import('./dictionaries/ko.json')

/**
 * 공식 가이드의 getDictionary 패턴. 언어마다 import()를 따로 두어,
 * 요청된 언어의 JSON 모듈만 서버에서 불러온다. fs로 읽지 않으므로 파일 추적 설정이 필요 없다.
 * 'server-only' 덕분에 클라이언트 컴포넌트가 이 파일을 import하면 빌드가 실패한다.
 */
const dictionaries = {
  ko: () => import('./dictionaries/ko.json').then((m) => m.default),
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  ja: () => import('./dictionaries/ja.json').then((m) => m.default),
} satisfies Record<Locale, () => Promise<Dictionary>>

/** lang은 URL에서 온 string이다. 지원 언어로 좁히고, 아니면 호출부에서 notFound()로 404를 만든다. */
export const hasLocale = (lang: string): lang is Locale => Object.hasOwn(dictionaries, lang)

export const getDictionary = async (lang: Locale): Promise<Dictionary> => dictionaries[lang]()

/** 중첩 사전을 "key.path → 문자열" 목록으로 편다. 화면의 사전 키 표시에 쓴다. */
export function flattenDictionary(dict: Dictionary): { key: string; value: string }[] {
  return Object.entries(dict as Record<string, Record<string, string>>).flatMap(([group, entries]) =>
    Object.entries(entries).map(([k, value]) => ({ key: `${group}.${k}`, value })),
  )
}
