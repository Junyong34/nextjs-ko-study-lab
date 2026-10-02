'use server'
import { headers } from 'next/headers'
import { REMOTE_SAMPLE_URL, SAMPLE_PATH, optimizerPath } from './lib/constants'
import type { EndpointProbe, ProbeOutcome } from './types'

const TARGETS: Pick<EndpointProbe, 'id' | 'label' | 'requestPath'>[] = [
  { id: 'local', label: '로컬 이미지 (sample/route.ts)', requestPath: optimizerPath(SAMPLE_PATH) },
  { id: 'remote', label: '원격 이미지 (cdn.shop.example)', requestPath: optimizerPath(REMOTE_SAMPLE_URL) },
]

async function probeOne(origin: string, target: (typeof TARGETS)[number]): Promise<EndpointProbe> {
  // 서버가 이 zone의 /_next/image를 직접 요청한다. optimizer가 없으면 원격 URL은 내려받지 않는다.
  const res = await fetch(`${origin}${target.requestPath}`, { cache: 'no-store', redirect: 'manual' })
  const body = await res.text()
  const contentType = res.headers.get('content-type')
  return {
    ...target,
    status: res.status,
    contentType,
    textBody: contentType?.startsWith('text/plain') ? body.slice(0, 200) : null,
    bytes: body.length,
  }
}

export async function probeImageEndpoint(): Promise<ProbeOutcome> {
  const h = await headers()
  // x-forwarded-host가 아니라 host를 쓴다. 셸의 rewrites를 거쳐도 이 zone은 자기 host로 요청을 받으므로,
  // 셸(별도 앱)의 /_next/image가 아니라 이 zone의 /_next/image를 재게 된다.
  const host = h.get('host')
  if (!host) return { ok: false, error: 'Host 헤더를 읽지 못했습니다.' }
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${host}`
  try {
    const results = await Promise.all(TARGETS.map((t) => probeOne(origin, t)))
    return { ok: true, origin, results, measuredAt: new Date().toISOString() }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : '측정 중 알 수 없는 오류' }
  }
}
