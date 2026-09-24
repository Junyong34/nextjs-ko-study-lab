import type { NextRequest } from 'next/server'
import { connection } from 'next/server'
import { getCachedPrice } from '../cachedData'
import { readSourcePrice } from '../priceStore'
import { nowStamp, parseProfileId } from '../tags'
import type { ProbeResult } from '../types'

/**
 * 1·2회차 "실제 요청". 페이지와 같은 getCachedPrice(id)를 호출하므로 같은 'use cache' 엔트리를 읽는다.
 * durationMs가 원본 지연(600ms) 근처면 이 요청이 재계산을 기다린 것(블로킹), 수 ms면 저장된 값을 받은 것이다.
 */
export async function GET(request: NextRequest) {
  await connection() // 빌드 시 정적 응답으로 굳지 않게 요청 시점에만 실행
  const id = parseProfileId(request.nextUrl.searchParams.get('profile'))
  if (!id) return Response.json({ error: '알 수 없는 profile' }, { status: 400 })

  const started = performance.now()
  const cached = await getCachedPrice(id)
  const durationMs = Math.round(performance.now() - started)

  const body: ProbeResult = { profileId: id, cached, source: readSourcePrice(id), servedAt: nowStamp().label, durationMs }
  return Response.json(body, { headers: { 'Cache-Control': 'no-store' } })
}
