import type { ProbeKind, ProbeResult } from '../types'

/** 실제 응답 본문을 DOMParser로 파싱해 루트 태그·항목 수·첫/끝 <loc>를 뽑는다. */
function parseSitemapXml(text: string, contentType: string | null) {
  if (!contentType?.includes('xml')) {
    return { rootTag: null, entryCount: 0, firstLoc: null, lastLoc: null }
  }
  const doc = new DOMParser().parseFromString(text, 'application/xml')
  if (doc.getElementsByTagName('parsererror').length > 0) {
    return { rootTag: 'parsererror', entryCount: 0, firstLoc: null, lastLoc: null }
  }
  const rootTag = doc.documentElement.localName
  const entryTag = rootTag === 'sitemapindex' ? 'sitemap' : 'url'
  const entries = Array.from(doc.getElementsByTagName(entryTag))
  const locOf = (el: Element | undefined) => el?.getElementsByTagName('loc')[0]?.textContent ?? null
  return {
    rootTag,
    entryCount: entries.length,
    firstLoc: locOf(entries[0]),
    lastLoc: locOf(entries[entries.length - 1]),
  }
}

export async function probe(kind: ProbeKind, label: string, path: string): Promise<ProbeResult> {
  // cache: 'no-store' — 브라우저 HTTP 캐시가 아닌 서버의 실제 응답을 매번 받는다.
  const res = await fetch(path, { cache: 'no-store' })
  const text = await res.text()
  const contentType = res.headers.get('content-type')
  return {
    kind,
    label,
    path,
    status: res.status,
    contentType,
    cacheHeader: res.headers.get('x-nextjs-cache'),
    bytes: new TextEncoder().encode(text).length,
    ...parseSitemapXml(text, contentType),
  }
}

/** "…/SKU-001000" → 1000 (연속성 검사용) */
export function skuNumber(loc: string | null): number | null {
  const match = loc?.match(/SKU-(\d+)$/)
  return match ? Number(match[1]) : null
}
