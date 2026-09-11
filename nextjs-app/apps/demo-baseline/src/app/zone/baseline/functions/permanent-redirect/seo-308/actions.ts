'use server'

import http from 'node:http'
import https from 'node:https'
import { headers } from 'next/headers'
import type { ProbeKind, ProbeResult } from './types'

const LEGACY_PATH_BY_KIND: Record<ProbeKind, string> = {
  permanent: '/zone/baseline/functions/permanent-redirect/seo-308/legacy/items',
  temporary: '/zone/baseline/functions/permanent-redirect/seo-308/legacy/promo',
}

function requestRawStatus(targetUrl: string): Promise<ProbeResult> {
  const client = targetUrl.startsWith('https:') ? https : http
  return new Promise((resolve, reject) => {
    const req = client.get(targetUrl, (res) => {
      resolve({
        status: res.statusCode ?? 0,
        statusText: res.statusMessage ?? '',
        location: (res.headers.location as string | undefined) ?? null,
      })
      res.resume()
    })
    req.on('error', reject)
  })
}

/**
 * 브라우저 fetch()는 redirect:'manual'이어도 WHATWG 스펙상 opaqueredirect로 상태 코드를 가리므로,
 * Node 저수준 http(s) 클라이언트로 우리 Route Handler(legacy/items, legacy/promo)에 직접 요청을 보내
 * permanentRedirect()/redirect()가 실제로 반환한 308/307 상태 코드와 Location 헤더를 그대로 읽는다.
 */
export async function probeRedirectAction(kind: ProbeKind, legacyId: string): Promise<ProbeResult> {
  const headerList = await headers()
  const host = headerList.get('host')
  const protocol = headerList.get('x-forwarded-proto') ?? 'http'
  const targetUrl = `${protocol}://${host}${LEGACY_PATH_BY_KIND[kind]}/${legacyId}`

  return requestRawStatus(targetUrl)
}
