import type { Locale } from './locales'

export type RunMode = 'production' | 'development'

export interface Leaf {
  key: string
  value: string
}

/** 언어별 page 1개를 실제로 GET 요청해 관측한 값. */
export interface PageObservation {
  lang: Locale
  status: number
  /** SSR HTML의 <article data-dict-lang> 값 */
  renderedLang: string | null
  /** 사전 원본(source/[lang])의 문자열 개수 */
  leafCount: number
  /** 사전 원본에 있지만 SSR HTML 본문에서 찾지 못한 키 */
  missingKeys: string[]
  xNextjsCache: string | null
  cacheControl: string | null
  /** 이 page HTML이 참조하는 JS 청크 URL */
  chunkUrls: string[]
  /** 이 page의 청크에서 발견된 사전 문자열 (자기 언어 / 다른 언어) */
  ownHits: string[]
  otherHits: string[]
}

export interface ProbeReport {
  mode: RunMode
  pages: PageObservation[]
  unsupported: { lang: string; status: number }
  /** 모든 page + 현재 문서가 실제 로드한 스크립트를 합친 고유 청크 수와 총 바이트 */
  chunkCount: number
  chunkBytes: number
  /** performance 리소스 타이밍으로 본, 현재 문서가 실제 로드한 스크립트 수 */
  loadedScriptCount: number
  /** 탐지 대조군: 클라이언트 컴포넌트 문자열이 청크에서 발견된 개수(1 이상이어야 스캔이 유효) */
  controlHits: number
  checks: { label: string; ok: boolean }[]
  ok: boolean
}
