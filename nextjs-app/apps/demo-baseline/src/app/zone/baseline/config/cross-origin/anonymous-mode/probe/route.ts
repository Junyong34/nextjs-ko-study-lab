import type { NextRequest } from 'next/server'
import { ERROR_MARKER, PROBE_GLOBAL } from '../lib/trials'
import type { CorsPolicy, ServerEcho } from '../types'

/**
 * <Script crossOrigin> 실습용 JS를 서빙하는 Route Handler.
 * - cors 쿼리로 Access-Control-Allow-Origin 응답 헤더를 바꾼다(none | star | echo).
 * - 스크립트 본문에 이 요청이 받은 Origin·Sec-Fetch-Mode 헤더를 담아 실행 시 전역 객체에 남긴다.
 * - 마지막 줄에서 일부러 오류를 던져 window error 이벤트가 상세 메시지를 받는지 확인하게 한다.
 * request를 읽으므로 요청마다 실행되는 동적 핸들러다.
 */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const trial = (params.get('trial') ?? '').replace(/[^a-z0-9-]/gi, '').slice(0, 60)
  const cors = parseCors(params.get('cors'))
  const origin = request.headers.get('origin')
  const echo: ServerEcho = { origin, secFetchMode: request.headers.get('sec-fetch-mode'), cors }

  const body = [
    `window[${JSON.stringify(PROBE_GLOBAL)}] = window[${JSON.stringify(PROBE_GLOBAL)}] || {};`,
    `window[${JSON.stringify(PROBE_GLOBAL)}][${JSON.stringify(trial)}] = ${JSON.stringify(echo)};`,
    `throw new Error(${JSON.stringify(`${ERROR_MARKER} ${trial}: 스크립트 안에서 던진 오류`)});`,
    '',
  ].join('\n')

  const headers = new Headers({
    'Content-Type': 'text/javascript; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  if (cors === 'star') headers.set('Access-Control-Allow-Origin', '*')
  if (cors === 'echo' && origin) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Credentials', 'true')
    headers.set('Vary', 'Origin')
  }
  return new Response(body, { headers })
}

function parseCors(value: string | null): CorsPolicy {
  return value === 'star' || value === 'echo' ? value : 'none'
}
