import type { ProbeResult, SitemapPlan } from '../types'
import { skuNumber } from './probe'

export interface Check {
  label: string
  expected: string
  actual: string
  ok: boolean
}

/** 파일 i에 들어가야 할 URL 수: min(파일당 상한, 남은 상품 수) */
function expectedCount(plan: SitemapPlan, id: number) {
  return Math.max(0, Math.min(plan.urlsPerSitemap, plan.totalProducts - id * plan.urlsPerSitemap))
}

/** 측정 결과를 catalog.ts로 계산한 기대값과 하나씩 대조한다. */
export function evaluate(plan: SitemapPlan, results: ProbeResult[]): Check[] {
  const splits = results.filter((r) => r.kind === 'split')
  const missing = results.find((r) => r.kind === 'missing-id')
  const segment = results.find((r) => r.kind === 'segment-sitemap')
  const index = results.find((r) => r.kind === 'handwritten-index')
  const checks: Check[] = []

  splits.forEach((r, id) => {
    const count = expectedCount(plan, id)
    const firstSku = id * plan.urlsPerSitemap + 1
    const lastSku = id * plan.urlsPerSitemap + count
    const ok =
      r.status === 200 &&
      r.rootTag === 'urlset' &&
      r.entryCount === count &&
      skuNumber(r.firstLoc) === firstSku &&
      skuNumber(r.lastLoc) === lastSku
    checks.push({
      label: `sitemap/${id}.xml`,
      expected: `200 · <urlset> · ${count}개 · SKU ${firstSku}~${lastSku}`,
      actual: `${r.status} · <${r.rootTag ?? '-'}> · ${r.entryCount}개 · SKU ${skuNumber(r.firstLoc) ?? '-'}~${skuNumber(r.lastLoc) ?? '-'}`,
      ok,
    })
  })

  const sum = splits.reduce((acc, r) => acc + r.entryCount, 0)
  const max = splits.reduce((acc, r) => Math.max(acc, r.entryCount), 0)
  checks.push({
    label: '분할 합계 / 파일당 최대',
    expected: `${plan.sitemapCount}개 파일 합계 ${plan.totalProducts}개, 파일당 ≤ ${plan.searchEngineLimit.toLocaleString()}`,
    actual: `${splits.length}개 파일 합계 ${sum}개, 최대 ${max}개`,
    ok: splits.length === plan.sitemapCount && sum === plan.totalProducts && max <= plan.searchEngineLimit,
  })

  if (missing) {
    checks.push({
      label: missing.label,
      expected: '404 (generateSitemaps에 없는 id)',
      actual: `${missing.status} · ${missing.contentType ?? '-'}`,
      ok: missing.status === 404,
    })
  }
  if (segment) {
    checks.push({
      label: segment.label,
      expected: '404 (인덱스 자동 생성 없음)',
      actual: `${segment.status}${segment.rootTag ? ` · <${segment.rootTag}>` : ''}`,
      ok: segment.status === 404,
    })
  }
  if (index) {
    const lastId = plan.sitemapCount - 1
    checks.push({
      label: index.label,
      expected: `200 · <sitemapindex> · ${plan.sitemapCount}개 · …/sitemap/0.xml ~ …/sitemap/${lastId}.xml`,
      actual: `${index.status} · <${index.rootTag ?? '-'}> · ${index.entryCount}개 · …${index.firstLoc?.slice(-14) ?? '-'} ~ …${index.lastLoc?.slice(-14) ?? '-'}`,
      ok:
        index.status === 200 &&
        index.rootTag === 'sitemapindex' &&
        index.entryCount === plan.sitemapCount &&
        Boolean(index.firstLoc?.endsWith(`${plan.demoPath}/sitemap/0.xml`)) &&
        Boolean(index.lastLoc?.endsWith(`${plan.demoPath}/sitemap/${lastId}.xml`)),
    })
  }
  return checks
}
