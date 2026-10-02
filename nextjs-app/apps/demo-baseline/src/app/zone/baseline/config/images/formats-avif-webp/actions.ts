'use server'
import { headers } from 'next/headers'
import { PRODUCT_SRC, optimizerPath } from './lib/constants'
import type { ProbeOutcome } from './types'

/**
 * 브라우저가 이미지 요청에 보낸 Accept를 그대로 실어 이 zone의 /_next/image를 요청한다.
 * optimizer가 켜져 있다면 Content-Type이 image/avif·image/webp로 바뀌고 Vary: Accept가 붙는 자리다.
 */
export async function probeOptimizer(imgAccept: string): Promise<ProbeOutcome> {
  const sentAccept = imgAccept.slice(0, 300)
  const h = await headers()
  // 셸 rewrites를 거쳐도 이 zone은 자기 host로 요청을 받는다. 셸이 아닌 이 zone의 /_next/image를 잰다.
  const host = h.get('host')
  if (!host) return { ok: false, error: 'Host 헤더를 읽지 못했습니다.' }
  const requestPath = optimizerPath(PRODUCT_SRC)
  try {
    const res = await fetch(`${h.get('x-forwarded-proto') ?? 'http'}://${host}${requestPath}`, {
      cache: 'no-store',
      redirect: 'manual',
      headers: { Accept: sentAccept },
    })
    // 본문을 끝까지 읽는다. dev 서버의 스트리밍 404 응답에 body.cancel()을 쓰면 Action이 끝나지 않았다.
    await res.text()
    return {
      ok: true,
      probe: {
        requestPath,
        sentAccept,
        status: res.status,
        contentType: res.headers.get('content-type'),
        vary: res.headers.get('vary'),
      },
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : '측정 중 알 수 없는 오류' }
  }
}
