import type { AssetProbe, PageProbe, ProbeKey, ProbeRun } from '../types'
import { CACHE_PAGE_PATH, INTERNAL_PATH, LEARNER_PATH, firstScriptInHtml, zoneOfScript } from './zone'

const PAGE_PATHS: Record<ProbeKey, string> = {
  learner: LEARNER_PATH,
  internal: INTERNAL_PATH,
  cache: CACHE_PAGE_PATH,
}

// 현재 문서와 같은 origin에 상대 경로로 문서 요청을 보낸다. 어느 zone이 응답했는지는 응답 HTML의 자산 접두사로 판별한다.
async function probePage(key: ProbeKey): Promise<PageProbe & { html: string }> {
  const path = PAGE_PATHS[key]
  const res = await fetch(path, { cache: 'no-store', headers: { accept: 'text/html' } })
  const html = await res.text()
  const firstScript = firstScriptInHtml(html)
  return {
    key,
    path,
    status: res.status,
    zone: zoneOfScript(firstScript),
    firstScript,
    poweredBy: res.headers.get('x-powered-by'),
    html,
  }
}

async function probeAsset(src: string): Promise<AssetProbe> {
  const res = await fetch(src, { cache: 'no-store' })
  return { path: src, status: res.status, contentType: res.headers.get('content-type') }
}

/** 이 문서가 실제로 내려받은 스크립트의 출처 접두사 (performance resource 항목) */
function countOwnAssets() {
  const scripts = performance
    .getEntriesByType('resource')
    .filter((e) => (e as PerformanceResourceTiming).initiatorType === 'script')
    .map((e) => new URL(e.name).pathname)
  const baseline = scripts.filter((p) => p.startsWith('/demo-static/baseline/_next/')).length
  return { baseline, other: scripts.length - baseline }
}

export async function runProbes(): Promise<ProbeRun> {
  const [learner, internal, cache] = await Promise.all([probePage('learner'), probePage('internal'), probePage('cache')])
  // cache 페이지 응답에 cache zone 스크립트가 있을 때만 그 자산을 같은 origin에서 다시 요청한다.
  const asset = cache.zone === 'cache' && cache.firstScript ? await probeAsset(cache.firstScript) : null
  const strip = ({ html: _html, ...p }: PageProbe & { html: string }): PageProbe => p
  return {
    origin: window.location.origin,
    pages: { learner: strip(learner), internal: strip(internal), cache: strip(cache) },
    asset,
    ownAssets: countOwnAssets(),
    measuredAt: new Date().toISOString(),
  }
}
