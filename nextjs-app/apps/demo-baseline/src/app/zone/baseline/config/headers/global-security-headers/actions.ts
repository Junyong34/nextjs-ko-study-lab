'use server'
import { headers } from 'next/headers'
import { PROBE_PATHS, type MeasureResult, type PathProbe } from './types'
import { WATCHED_HEADERS } from './lib/scope'

async function probeOne(origin: string, path: string): Promise<PathProbe> {
  // 서버가 같은 앱의 해당 경로를 직접 요청한다. 브라우저 캐시·확장 프로그램이 끼지 않은 실제 응답 헤더다.
  const res = await fetch(`${origin}${path}`, { cache: 'no-store', redirect: 'manual' })
  await res.body?.cancel()
  const picked: Record<string, string | null> = {}
  for (const name of WATCHED_HEADERS) picked[name] = res.headers.get(name)
  return { path, status: res.status, headers: picked, measuredAt: new Date().toISOString() }
}

export async function measureHeaders(targetPath: string, controlPath: string): Promise<MeasureResult> {
  const allowed: string[] = PROBE_PATHS.map((p) => p.path)
  if (!allowed.includes(targetPath) || !allowed.includes(controlPath)) {
    return { ok: false, error: '허용되지 않은 경로입니다.' }
  }
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  if (!host) return { ok: false, error: 'Host 헤더를 읽지 못했습니다.' }
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${host}`
  try {
    const [target, control] = await Promise.all([probeOne(origin, targetPath), probeOne(origin, controlPath)])
    return { ok: true, target, control }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : '측정 중 알 수 없는 오류' }
  }
}
