import http from 'node:http'
import type { Transport } from './scenarios'
import type { TenantResponse } from '../types'

const PATH = '/zone/baseline/guides/multi-tenant/subdomain-tenant/api/tenant'
// 로컬 dev 서버(포트 3001 고정)에 직접 요청한다. 배포 환경의 자기 호출은 검증하지 않았다.
const PORT = Number(process.env.PORT ?? 3001)

interface Raw {
  status: number
  body: TenantResponse
}

/** node:http 는 Host 헤더를 그대로 전송한다. */
function viaHttp(host: string): Promise<Raw> {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port: PORT, path: PATH, headers: { Host: host } }, (res) => {
      let data = ''
      res.on('data', (c) => (data += c))
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode ?? 0, body: JSON.parse(data) })
        } catch (e) {
          reject(e)
        }
      })
    })
    req.on('error', reject)
  })
}

/** fetch(undici)는 Host 를 덮어쓰지 않는다. 그래서 x-forwarded-host 같은 규약 헤더를 함께 시험한다. */
async function viaFetch(headers: Record<string, string>): Promise<Raw> {
  const res = await fetch(`http://127.0.0.1:${PORT}${PATH}`, { headers, cache: 'no-store' })
  return { status: res.status, body: await res.json() }
}

/** 전송 방식에 맞는 헤더를 만들고 같은 앱의 Route Handler 를 실제 HTTP 로 호출한다. */
export async function requestTenantRoute(transport: Transport, host: string) {
  const sent: Record<string, string> = transport === 'fetch-forwarded' ? { 'x-forwarded-host': host } : { Host: host }
  const raw = transport === 'http-host' ? await viaHttp(host) : await viaFetch(sent)
  return { sent, ...raw }
}
