/** page.tsx(서버)가 catalog.ts로 계산해 클라이언트에 넘기는 기대값 */
export interface SitemapPlan {
  demoPath: string
  totalProducts: number
  urlsPerSitemap: number
  searchEngineLimit: number
  sitemapCount: number
}

export type ProbeKind = 'split' | 'missing-id' | 'segment-sitemap' | 'handwritten-index'

/** 브라우저가 실제 fetch + DOMParser로 측정한 결과 한 건 */
export interface ProbeResult {
  kind: ProbeKind
  label: string
  path: string
  status: number
  contentType: string | null
  cacheHeader: string | null
  bytes: number
  rootTag: string | null
  /** <urlset>의 <url> 또는 <sitemapindex>의 <sitemap> 개수 */
  entryCount: number
  firstLoc: string | null
  lastLoc: string | null
}
