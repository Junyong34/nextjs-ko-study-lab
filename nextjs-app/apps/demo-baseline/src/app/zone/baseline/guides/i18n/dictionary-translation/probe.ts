import { LOCALES, UNSUPPORTED_LANG, pageHref, sourceHref, type Locale } from './locales'
import type { Leaf, PageObservation, ProbeReport, RunMode } from './types'

/** 이 번들이 빌드된 모드. next dev면 'development', next build 산출물이면 'production'으로 인라인된다. */
export const RUN_MODE: RunMode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

/** 탐지 대조군. LangNav(클라이언트 컴포넌트)가 화면에 그리는 문자열이라 반드시 JS 청크에 있어야 한다. */
export const CLIENT_CONTROL_TEXT = '표시 언어 선택 (클라이언트 컴포넌트)'

const CHUNK_RE = /[^"'\s\\()]*\/_next\/static\/[^"'\s\\()]+?\.js(?:\?[^"'\s\\()]*)?/g

/** 사전 원본 JSON을 요청 시 받아 와 문자열 목록으로 편다(검색어가 번들에 들어가지 않게). */
async function loadLeaves(lang: Locale): Promise<Leaf[]> {
  const res = await fetch(sourceHref(lang), { cache: 'no-store' })
  if (!res.ok) throw new Error(`${sourceHref(lang)} → ${res.status}`)
  const json = (await res.json()) as Record<string, Record<string, string>>
  return Object.entries(json).flatMap(([g, e]) => Object.entries(e).map(([k, value]) => ({ key: `${g}.${k}`, value })))
}

/** 번들러가 비ASCII를 \uXXXX로 이스케이프했을 경우까지 찾도록 표기 변형을 만든다. */
function variants(s: string): string[] {
  const esc = (upper: boolean) =>
    s.replace(/[^\x00-\x7f]/g, (c) => {
      const hex = c.charCodeAt(0).toString(16).padStart(4, '0')
      return `\\u${upper ? hex.toUpperCase() : hex}`
    })
  return [...new Set([s, esc(false), esc(true)])]
}

const found = (text: string, needle: string) => variants(needle).some((v) => text.includes(v))

function chunkUrlsOf(html: string): string[] {
  return [...new Set(html.match(CHUNK_RE) ?? [])].map((u) => new URL(u, location.href).href)
}

function loadedScriptUrls(): string[] {
  return performance
    .getEntriesByType('resource')
    .map((e) => e.name)
    .filter((n) => /\/_next\/static\/.+\.js(\?|$)/.test(n))
}

export async function runProbe(): Promise<ProbeReport> {
  const leaves = new Map<Locale, Leaf[]>()
  for (const lang of LOCALES) leaves.set(lang, await loadLeaves(lang))

  const pages: Omit<PageObservation, 'ownHits' | 'otherHits'>[] = []
  for (const lang of LOCALES) {
    const res = await fetch(pageHref(lang), { cache: 'no-store' })
    const html = await res.text()
    const article = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-dict-lang]')
    const text = article?.textContent ?? ''
    pages.push({
      lang,
      status: res.status,
      renderedLang: article?.getAttribute('data-dict-lang') ?? null,
      leafCount: leaves.get(lang)!.length,
      missingKeys: leaves.get(lang)!.filter((l) => !text.includes(l.value)).map((l) => l.key),
      xNextjsCache: res.headers.get('x-nextjs-cache'),
      cacheControl: res.headers.get('cache-control'),
      chunkUrls: chunkUrlsOf(html),
    })
  }
  const unsupportedRes = await fetch(pageHref(UNSUPPORTED_LANG), { cache: 'no-store' })

  // 모든 page가 참조하는 청크 + 지금 이 문서가 실제로 내려받은 스크립트를 한 번씩만 받아 둔다.
  const loaded = loadedScriptUrls()
  const allUrls = [...new Set([...pages.flatMap((p) => p.chunkUrls), ...loaded])]
  const bodies = new Map<string, string>()
  for (const url of allUrls) {
    const res = await fetch(url)
    bodies.set(url, res.ok ? await res.text() : '')
  }

  const hitsIn = (urls: string[], ls: Leaf[], lang: Locale) =>
    ls.filter((l) => urls.some((u) => found(bodies.get(u) ?? '', l.value))).map((l) => `${lang}:${l.key}`)
  const allLeaves = LOCALES.flatMap((lang) => leaves.get(lang)!.map((l) => ({ ...l, lang })))

  const observed: PageObservation[] = pages.map((p) => ({
    ...p,
    ownHits: hitsIn(p.chunkUrls, leaves.get(p.lang)!, p.lang),
    otherHits: LOCALES.filter((l) => l !== p.lang).flatMap((l) => hitsIn(p.chunkUrls, leaves.get(l)!, l)),
  }))
  const loadedHits = allLeaves.filter((l) => loaded.some((u) => found(bodies.get(u) ?? '', l.value)))
  const controlHits = allUrls.filter((u) => found(bodies.get(u) ?? '', CLIENT_CONTROL_TEXT)).length
  const chunkBytes = [...bodies.values()].reduce((sum, b) => sum + b.length, 0)

  const checks = [
    ...observed.map((p) => ({
      label: `${p.lang}: 200 · data-dict-lang=${p.lang} · 사전 문자열 ${p.leafCount}개 전부 SSR HTML에 존재`,
      ok: p.status === 200 && p.renderedLang === p.lang && p.missingKeys.length === 0,
    })),
    ...observed.map((p) => ({
      label: `${p.lang}: 청크 ${p.chunkUrls.length}개에 다른 언어·자기 언어 사전 문자열 0건`,
      ok: p.chunkUrls.length > 0 && p.otherHits.length === 0 && p.ownHits.length === 0,
    })),
    { label: `현재 문서가 로드한 스크립트 ${loaded.length}개에 사전 문자열 0건`, ok: loaded.length > 0 && loadedHits.length === 0 },
    { label: '대조군: 클라이언트 컴포넌트 문자열은 청크에서 발견됨(스캔 유효)', ok: controlHits > 0 },
    { label: `${UNSUPPORTED_LANG}: 404`, ok: unsupportedRes.status === 404 },
    ...(RUN_MODE === 'production'
      ? observed.map((p) => ({ label: `${p.lang}: x-nextjs-cache 존재 (빌드 때 만든 HTML)`, ok: p.xNextjsCache !== null }))
      : []),
  ]

  return {
    mode: RUN_MODE,
    pages: observed,
    unsupported: { lang: UNSUPPORTED_LANG, status: unsupportedRes.status },
    chunkCount: allUrls.length,
    chunkBytes,
    loadedScriptCount: loaded.length,
    controlHits,
    checks,
    ok: checks.every((c) => c.ok),
  }
}
