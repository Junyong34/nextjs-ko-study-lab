import type { DestinationProbe, Measurement, Prediction, Scenario } from '../types'

const toPath = (url: string) => {
  const u = new URL(url, window.location.origin)
  return `${u.pathname}${u.search}`
}

// 응답 HTML에서 목적지 페이지가 심어 둔 data-rewrite-probe를 읽는다. 없으면(404 등) null.
function readProbe(html: string): DestinationProbe | null {
  const raw = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-rewrite-probe]')?.getAttribute('data-rewrite-probe')
  if (!raw) return null
  try {
    return JSON.parse(raw) as DestinationProbe
  } catch {
    return null
  }
}

/**
 * 시나리오의 URL로 실제 요청을 보내 상태·응답 URL·목적지가 받은 값을 잰다.
 * redirect: 'manual'이라 3xx가 오면 opaqueredirect로 드러난다(rewrite는 3xx를 만들지 않는다).
 */
export async function measure(scenario: Scenario, value: string, prediction: Prediction | null): Promise<Measurement> {
  const base = window.location.pathname.replace(/\/$/, '')
  const requestedPath = `${base}${scenario.buildPath(value)}`
  const res = await fetch(requestedPath, { cache: 'no-store', redirect: 'manual', headers: { Accept: 'text/html' } })
  const probe = res.type === 'opaqueredirect' ? null : readProbe(await res.text())
  return {
    scenario: scenario.id,
    value,
    requestedPath: toPath(requestedPath),
    responsePath: toPath(res.url || requestedPath),
    status: res.status,
    responseType: res.type,
    probe,
    measuredAt: new Date().toLocaleTimeString('ko-KR'),
    prediction,
  }
}
