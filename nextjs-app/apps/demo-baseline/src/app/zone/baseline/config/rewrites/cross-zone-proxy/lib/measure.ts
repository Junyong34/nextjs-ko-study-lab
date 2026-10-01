import type { Measurement, Scenario, ZoneEvidence, ZoneId } from '../types'

const DEMO_SEGMENT = '/config/rewrites/cross-zone-proxy'

const toPath = (url: string) => {
  const u = new URL(url, window.location.origin)
  return `${u.pathname}${u.search}`
}

const count = (text: string, needle: string) => text.split(needle).length - 1

// 각 zone은 assetPrefix가 다르다(baseline: /demo-static/baseline, cache: /demo-static/cache).
// 응답 HTML이 어느 접두사의 스크립트·CSS를 참조하는지로 그 HTML을 렌더한 zone을 판정한다.
function zoneFromHtml(html: string): ZoneEvidence {
  const cache = count(html, '/demo-static/cache/')
  const baseline = count(html, '/demo-static/baseline/')
  const basis = `HTML의 자산 경로: /demo-static/cache/ ${cache}회, /demo-static/baseline/ ${baseline}회`
  const zone: ZoneId | null = cache > 0 && baseline === 0 ? 'cache' : baseline > 0 && cache === 0 ? 'baseline' : null
  return { zone, basis }
}

async function sha256(blob: Blob) {
  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer())
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * 시나리오의 URL로 실제 요청을 보내 상태·응답 URL·헤더·본문의 zone 마커를 잰다.
 * 기본 redirect: 'follow'라 3xx가 끼어들면 redirected=true와 바뀐 응답 URL로 드러난다.
 */
export async function measure(scenario: Scenario, title: string, prediction: ZoneId | null): Promise<Measurement> {
  const base = window.location.pathname.replace(/\/$/, '')
  const zoneRoot = base.includes(DEMO_SEGMENT) ? base.slice(0, base.indexOf(DEMO_SEGMENT)) : '/zone/baseline'
  const requestedPath = `${base}${scenario.buildPath(title)}`
  const res = await fetch(requestedPath, { cache: 'no-store', headers: { Accept: scenario.kind === 'html' ? 'text/html' : 'image/png' } })
  const contentType = res.headers.get('content-type') ?? ''

  let evidence: ZoneEvidence = { zone: null, basis: '응답 본문에 zone을 가릴 마커가 없음' }
  let imageUrl: string | null = null
  let baselineImageUrl: string | null = null
  let errorBody: string | null = null

  if (res.status >= 500) {
    errorBody = (await res.text()).slice(0, 160)
  } else if (contentType.startsWith('image/')) {
    // 같은 title로 baseline 자체 /og를 함께 받아 바이트를 비교한다. 두 zone의 OG 라우트는 기본 eyebrow 문구가 다르다.
    const own = await fetch(`${zoneRoot}/og?title=${encodeURIComponent(title)}`, { cache: 'no-store' })
    const [proxied, local] = [await res.blob(), await own.blob()]
    const same = (await sha256(proxied)) === (await sha256(local))
    imageUrl = URL.createObjectURL(proxied)
    baselineImageUrl = URL.createObjectURL(local)
    evidence = {
      zone: same ? 'baseline' : 'cache',
      basis: same ? 'baseline 자체 /og 응답과 바이트가 같음' : 'baseline 자체 /og 응답(같은 title)과 바이트가 다름',
    }
  } else {
    evidence = zoneFromHtml(await res.text())
  }

  return {
    scenario: scenario.id,
    title,
    requestedPath: toPath(requestedPath),
    responsePath: toPath(res.url || requestedPath),
    status: res.status,
    redirected: res.redirected,
    contentType,
    poweredBy: res.headers.get('x-powered-by'),
    evidence,
    imageUrl,
    baselineImageUrl,
    errorBody,
    measuredAt: new Date().toLocaleTimeString('ko-KR'),
    prediction,
  }
}
