import type { BurstResult, CapturedRequestError, FailProbe, ProbeRuntime, RegisterProbe } from '../types'

export const BURST_SIZE = 10

// 데모 페이지 URL 아래의 Route Handler 경로. 셸 경유 여부와 관계없이 현재 주소 기준으로 만든다.
const apiPath = (name: string) => `${window.location.pathname.replace(/\/$/, '')}/api/${name}`

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', ...init })
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
  return (await res.json()) as T
}

/** 같은 런타임의 Route Handler에 BURST_SIZE번 순서대로 요청해 응답을 모두 모은다. */
export async function runBurst(runtime: ProbeRuntime): Promise<BurstResult> {
  const url = apiPath(runtime === 'nodejs' ? 'node' : 'edge')
  const probes: RegisterProbe[] = []
  for (let i = 0; i < BURST_SIZE; i += 1) probes.push(await getJson<RegisterProbe>(url))
  return { runtime, probes, measuredAt: new Date().toLocaleTimeString('ko-KR') }
}

interface ErrorLog {
  entries: CapturedRequestError[]
  registerCallCount: number | null
}

/** 일부러 실패하는 POST를 보내고, 그 전후로 onRequestError 기록과 registerCallCount를 읽는다. */
export async function runFailProbe(): Promise<FailProbe> {
  const url = apiPath('fail')
  const before = await getJson<ErrorLog>(url)
  const res = await fetch(url, { method: 'POST', cache: 'no-store' })
  const after = await getJson<ErrorLog>(url)
  const seen = new Set(before.entries.map((e) => e.capturedAt))
  return {
    status: res.status,
    captured: after.entries.filter((e) => !seen.has(e.capturedAt)),
    registerCountBefore: before.registerCallCount,
    registerCountAfter: after.registerCallCount,
  }
}
