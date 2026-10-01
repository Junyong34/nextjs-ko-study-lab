'use server'

import http from 'node:http'
import { headers } from 'next/headers'
import { buildSentRequest } from './lib/request'
import type { ProbeInput, ProbeOutcome, SentRequest } from './types'

function rawGet(connectHost: string, sent: SentRequest): Promise<Pick<ProbeOutcome, 'status' | 'location' | 'body'>> {
  const [hostname, port] = connectHost.split(':')
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname,
        port: port ? Number(port) : 80,
        path: `${sent.pathname}${sent.search}`,
        method: 'GET',
        // 브라우저 fetch()는 임의 헤더(특히 Host)를 보낼 수 없고, Node 내장 fetch도 Host를 덮어쓰지 못한다.
        // 그래서 저수준 http.request로 헤더를 그대로 실어 보내고, redirect를 따라가지 않은 원본 응답을 읽는다.
        headers: { ...sent.headers, host: sent.host },
      },
      (res) => {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => (body += chunk))
        res.on('end', () =>
          resolve({
            status: res.statusCode ?? null,
            location: (res.headers.location as string | undefined) ?? null,
            body: res.statusCode && res.statusCode < 300 ? body.slice(0, 200) : null,
          }),
        )
      },
    )
    req.on('error', reject)
    req.end()
  })
}

/**
 * 학습자가 구성한 조건(헤더/쿠키/쿼리/Host)으로 이 서버의 probe 경로에 실제 요청을 보내
 * next.config redirects()가 돌려준 상태 코드와 Location을 그대로 측정한다.
 */
export async function probeConditionAction(input: ProbeInput): Promise<ProbeOutcome> {
  const headerList = await headers()
  // 요청이 들어온 서버 자신(host:port)에 접속한다.
  const serverHost = headerList.get('host') ?? 'localhost:3000'
  const sent = buildSentRequest(input, serverHost)
  try {
    return { sent, ...(await rawGet(serverHost, sent)), error: null }
  } catch (e) {
    return { sent, status: null, location: null, body: null, error: e instanceof Error ? e.message : String(e) }
  }
}
