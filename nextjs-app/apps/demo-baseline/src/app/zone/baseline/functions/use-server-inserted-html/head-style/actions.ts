'use server'

import http from 'node:http'
import https from 'node:https'
import { headers } from 'next/headers'
import type { ProbeVariant, RegistryComparisonResult, RegistryProbeResult } from './types'

const PATH_BY_VARIANT: Record<ProbeVariant, string> = {
  'with-hook': '/zone/baseline/functions/use-server-inserted-html/head-style/with-hook',
  'without-hook': '/zone/baseline/functions/use-server-inserted-html/head-style/without-hook',
}

const REGISTRY_STYLE_TAG_RE = /<style[^>]*data-demo-registry="[^"]*"[^>]*>[\s\S]*?<\/style>/g

/**
 * 브라우저 fetch()는 JS로 렌더된 DOM만 보여줄 수 있어 하이드레이션 이후 상태와
 * 서버가 실제로 보낸 원본 바이트를 구분하지 못한다. permanent-redirect/seo-308의
 * probeRedirectAction과 동일하게 Node 저수준 http(s) 클라이언트로 직접 요청해
 * Next.js가 실제로 스트리밍한 원본 HTML 문자열을 그대로 읽는다.
 */
function fetchRawHtml(targetUrl: string): Promise<{ status: number; body: string }> {
  const client = targetUrl.startsWith('https:') ? https : http
  return new Promise((resolve, reject) => {
    const req = client.get(targetUrl, (res) => {
      const chunks: Buffer[] = []
      res.on('data', (chunk: Buffer) => chunks.push(chunk))
      res.on('end', () => {
        resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString('utf8') })
      })
      res.on('error', reject)
    })
    req.on('error', reject)
  })
}

function snippetAround(html: string, index: number, before: number, after: number): string {
  const start = Math.max(0, index - before)
  const end = Math.min(html.length, index + after)
  return `${start > 0 ? '…' : ''}${html.slice(start, end).trim()}${end < html.length ? '…' : ''}`
}

function analyze(variant: ProbeVariant, status: number, html: string): RegistryProbeResult {
  const headCloseIndex = html.indexOf('</head>')
  const matches = [...html.matchAll(REGISTRY_STYLE_TAG_RE)]

  const headMatch = matches.find((m) => headCloseIndex !== -1 && (m.index ?? -1) < headCloseIndex)
  const bodyMatch = matches.find((m) => headCloseIndex !== -1 && (m.index ?? -1) > headCloseIndex)

  return {
    variant,
    status,
    headInjectionFound: Boolean(headMatch),
    bodyInjectionFound: Boolean(bodyMatch),
    styleTagCount: matches.length,
    headSnippet: headCloseIndex === -1
      ? '(</head>를 찾지 못했습니다)'
      : snippetAround(html, headCloseIndex, headMatch ? headMatch[0].length + 40 : 80, 20),
    bodySnippet: bodyMatch
      ? snippetAround(html, bodyMatch.index ?? 0, 20, bodyMatch[0].length + 20)
      : '(</head> 뒤에서 data-demo-registry 태그를 찾지 못했습니다)',
  }
}

export async function compareRegistryInjectionAction(): Promise<RegistryComparisonResult> {
  const headerList = await headers()
  const host = headerList.get('host')
  const protocol = headerList.get('x-forwarded-proto') ?? 'http'

  const [withHookRes, withoutHookRes] = await Promise.all([
    fetchRawHtml(`${protocol}://${host}${PATH_BY_VARIANT['with-hook']}`),
    fetchRawHtml(`${protocol}://${host}${PATH_BY_VARIANT['without-hook']}`),
  ])

  return {
    withHook: analyze('with-hook', withHookRes.status, withHookRes.body),
    withoutHook: analyze('without-hook', withoutHookRes.status, withoutHookRes.body),
    fetchedAt: new Date().toLocaleTimeString('ko-KR'),
  }
}
