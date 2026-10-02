import { revalidateTag } from 'next/cache'
import { connection } from 'next/server'
import { readCachedSnapshot, readServerInstance, SNAPSHOT_TAG } from '../lib/cachedSnapshot'
import type { ProbeBody } from '../types'

// GET  → 'use cache' 함수를 한 번 호출한 결과와 이 요청을 처리한 프로세스 정보
export async function GET() {
  // 매 요청마다 실행되게 한다. 캐시 여부는 Route Handler가 아니라 안쪽 'use cache' 함수가 결정한다.
  await connection()
  try {
    const snapshot = await readCachedSnapshot()
    const body: ProbeBody = { ok: true, op: 'read', snapshot, instance: readServerInstance(), servedAt: Date.now() }
    return Response.json(body)
  } catch (error) {
    const body: ProbeBody = { ok: false, error: (error as Error).message }
    return Response.json(body, { status: 500 })
  }
}

// POST → 데모 태그를 즉시 만료시킨다. 기본 핸들러의 updateTags()가 이 프로세스 안의 태그 시각을 갱신한다.
export async function POST() {
  await connection()
  // { expire: 0 }: stale 응답 없이 다음 읽기에서 바로 다시 계산한다. (Server Action이라면 updateTag를 쓴다.)
  revalidateTag(SNAPSHOT_TAG, { expire: 0 })
  const body: ProbeBody = { ok: true, op: 'invalidate', tag: SNAPSHOT_TAG, instance: readServerInstance(), servedAt: Date.now() }
  return Response.json(body)
}
