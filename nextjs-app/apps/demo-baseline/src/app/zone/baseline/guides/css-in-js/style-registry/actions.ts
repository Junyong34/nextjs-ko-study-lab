'use server'

import { headers } from 'next/headers'
import { analyzeHtml } from './lib/analyze'
import { DEMO_BASE_PATH, type RegistryVariant, type ServerProbeResult } from './types'

async function fetchRawHtml(variant: RegistryVariant, origin: string) {
  // 브라우저 fetch는 하이드레이션 이후 DOM과 서버가 보낸 바이트를 구분하지 못한다.
  // 서버에서 같은 앱의 라우트를 직접 요청해 스트리밍된 원본 HTML 문자열을 읽는다.
  const res = await fetch(`${origin}${DEMO_BASE_PATH}/${variant}`, { cache: 'no-store' })
  return analyzeHtml(variant, res.status, await res.text())
}

export async function probeServerHtmlAction(): Promise<ServerProbeResult> {
  const headerList = await headers()
  const origin = `${headerList.get('x-forwarded-proto') ?? 'http'}://${headerList.get('host')}`

  const [withRegistry, withoutRegistry] = await Promise.all([
    fetchRawHtml('with-registry', origin),
    fetchRawHtml('without-registry', origin),
  ])
  return { withRegistry, withoutRegistry, fetchedAt: new Date().toLocaleTimeString('ko-KR') }
}
