import { revalidateTag } from 'next/cache'
import { bumpSourcePrice } from '../priceStore'
import { PROFILES, parseProfileId } from '../tags'
import type { InvalidateResult } from '../types'

/**
 * 가격 변경 웹훅 역할의 Route Handler. 원본 버전을 올리고 줄마다 다른 profile로 revalidateTag를 호출한다.
 * (updateTag와 달리 revalidateTag는 Route Handler에서도 호출할 수 있다.)
 */
export async function POST(request: Request) {
  const { profile } = (await request.json().catch(() => ({}))) as { profile?: unknown }
  const id = parseProfileId(profile)
  if (!id) return Response.json({ error: '알 수 없는 profile' }, { status: 400 })

  const row = PROFILES[id]
  const sourceAfter = bumpSourcePrice(id)
  revalidateTag(row.tag, row.profile)

  const body: InvalidateResult = { profileId: id, code: row.code, sourceAfter }
  return Response.json(body, { headers: { 'Cache-Control': 'no-store' } })
}
