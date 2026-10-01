import type { ProbeRun, ProbeSample } from '../types'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const attr = (html: string, name: string) => html.match(new RegExp(`data-${name}="([^"]+)"`))?.[1] ?? null

/** 상품 URL을 한 번 요청해 상태·응답 헤더·HTML에 심긴 렌더 시각을 읽는다. */
async function sampleOnce(url: string): Promise<ProbeSample> {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    const html = await res.text()
    return {
      status: res.status,
      renderedAt: attr(html, 'rendered-at'),
      nodeEnv: attr(html, 'node-env'),
      cacheControl: res.headers.get('cache-control'),
      nextjsCache: res.headers.get('x-nextjs-cache'),
      nextjsPrerender: res.headers.get('x-nextjs-prerender'),
      receivedAt: Date.now(),
    }
  } catch {
    return { status: 0, renderedAt: null, nodeEnv: null, cacheControl: null, nextjsCache: null, nextjsPrerender: null, receivedAt: Date.now() }
  }
}

/** 같은 id를 gapMs 간격으로 두 번 요청한다. 렌더 시각이 같으면 고정, 다르면 요청마다 렌더다. */
export async function probeProduct(basePath: string, id: string, gapMs = 1200): Promise<ProbeRun> {
  const url = `${basePath.replace(/\/$/, '')}/products/${id}`
  const first = await sampleOnce(url)
  await sleep(gapMs)
  const second = await sampleOnce(url)
  return { id, url, samples: [first, second] }
}
