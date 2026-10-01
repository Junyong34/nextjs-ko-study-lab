import type { HopKind, ZoneName } from '../types'

// 이 데모가 같은 origin에 보내는 경로. 셸 rewrites(apps/shell/next.config.ts)의 source와 대응한다.
export const DEMO_URL = 'guides/multi-zones/cross-zone-routing'
export const INTERNAL_PATH = `/zone/baseline/${DEMO_URL}`
export const LEARNER_PATH = `/demo/${DEMO_URL}`
// cache zone의 done 데모 중 GET만으로 상태가 바뀌지 않는 페이지('use cache' 읽기 전용)
export const CACHE_PAGE_PATH = '/zone/cache/caching/basic'
export const HOP_PATH = `${INTERNAL_PATH}/hop`
export const ARRIVAL_PATH = `${HOP_PATH}/arrival`

export const HOP_TARGET: Record<HopKind, string> = {
  'link-same': ARRIVAL_PATH,
  'a-same': ARRIVAL_PATH,
  'link-cross': CACHE_PAGE_PATH,
  'a-cross': CACHE_PAGE_PATH,
}

/** 스크립트 경로의 접두사로 zone을 판별한다. 셸은 assetPrefix가 없어 /_next/에서 바로 시작한다. */
export function zoneOfScript(src: string | null | undefined): ZoneName {
  if (!src) return 'unknown'
  const path = src.replace(/^https?:\/\/[^/]+/, '')
  if (path.startsWith('/demo-static/baseline/_next/')) return 'baseline'
  if (path.startsWith('/demo-static/cache/_next/')) return 'cache'
  if (path.startsWith('/_next/')) return 'shell'
  return 'unknown'
}

/** 응답 HTML 문자열에서 첫 _next/static 스크립트 경로를 꺼낸다. */
export function firstScriptInHtml(html: string): string | null {
  for (const m of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
    if (m[1].includes('/_next/static/')) return m[1]
  }
  return null
}

/** 렌더된 문서의 script 요소에서 zone을 판별한다 (iframe 관찰용). */
export function zoneOfDocument(doc: Document): ZoneName {
  const src = Array.from(doc.querySelectorAll<HTMLScriptElement>('script[src]'))
    .map((s) => s.getAttribute('src'))
    .find((s) => s?.includes('/_next/static/'))
  return zoneOfScript(src)
}

export const ZONE_LABEL: Record<ZoneName, string> = {
  shell: 'shell (/_next/)',
  baseline: 'baseline (/demo-static/baseline/)',
  cache: 'cache (/demo-static/cache/)',
  unknown: '판별 불가',
}
