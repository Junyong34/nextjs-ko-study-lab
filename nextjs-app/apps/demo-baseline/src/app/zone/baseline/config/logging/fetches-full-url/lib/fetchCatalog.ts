import 'server-only'
import { headers } from 'next/headers'
import type { CatalogEcho, FetchRun } from '../types'

const DEMO_PATH = '/zone/baseline/config/logging/fetches-full-url'

// 실무에서 흔한 "필터 + 추적 파라미터" 조합. 전체 URL이 48자를 훌쩍 넘어
// logging.fetches를 켠 상태에서 fullUrl이 false면 터미널에서 잘리는 길이다.
export const CATALOG_QUERY = new URLSearchParams({
  category: 'running-shoes',
  sizes: '250,255,260,265,270',
  colors: 'black,white,navy',
  sort: 'price-asc',
  page: '1',
  utm_source: 'newsletter',
  utm_campaign: 'autumn-sale',
}).toString()

/** 서버 컴포넌트 렌더 중에 같은 앱의 Route Handler로 실제 fetch를 보낸다. */
export async function fetchCatalog(): Promise<FetchRun> {
  const renderedAt = new Date().toISOString()
  const nodeEnv = process.env.NODE_ENV ?? 'unknown'
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${host ?? 'localhost:3001'}`
  const url = `${origin}${DEMO_PATH}/api/catalog?${CATALOG_QUERY}`

  const started = performance.now()
  try {
    // cache: 'no-store'라서 터미널 fetch 로그가 켜져 있다면 (cache skip)과 이유가 함께 찍힌다.
    const res = await fetch(url, { cache: 'no-store' })
    const echo: CatalogEcho = await res.json()
    return {
      ok: true,
      url,
      sentSearch: `?${CATALOG_QUERY}`,
      status: res.status,
      durationMs: Math.round(performance.now() - started),
      echo,
      renderedAt,
      nodeEnv,
    }
  } catch (e) {
    return { ok: false, url, error: e instanceof Error ? e.message : 'fetch 실패', renderedAt, nodeEnv }
  }
}
