import { connection, type NextRequest } from 'next/server'
import { FAULT_READERS, PRESET_READERS } from '../cachedData'
import type { FaultKey, PresetKey, ProbeBody } from '../types'

// GET ?preset=short|medium|long  → 해당 프리셋에 바인딩된 'use cache' 함수를 한 번 호출한 결과
// GET ?fault=invalid-order|unknown-profile → 잘못된 cacheLife 사용이 던지는 Next.js 오류
export async function GET(request: NextRequest) {
  // 매 요청마다 실행되게 한다. 캐시 여부는 Route Handler가 아니라 안쪽 'use cache' 함수가 결정한다.
  await connection()
  const params = request.nextUrl.searchParams
  const fault = params.get('fault') as FaultKey | null
  const preset = params.get('preset') as PresetKey | null

  const reader = fault ? FAULT_READERS[fault] : preset ? PRESET_READERS[preset] : undefined
  if (!reader) {
    return Response.json({ ok: false, error: 'preset 또는 fault 쿼리가 올바르지 않습니다.' } satisfies ProbeBody, {
      status: 400,
    })
  }

  try {
    const entry = await reader()
    const body: ProbeBody = { ok: true, preset, ...entry, servedAt: Date.now() }
    return Response.json(body)
  } catch (error) {
    // cacheLife()가 던진 Next.js 오류 메시지를 그대로 돌려준다 (판정은 클라이언트가 메시지로 한다).
    const body: ProbeBody = { ok: false, error: (error as Error).message }
    return Response.json(body, { status: 500 })
  }
}
