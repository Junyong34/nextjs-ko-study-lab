'use server'

import { revalidateTag, updateTag } from 'next/cache'
import { changeQty } from './cartStore'
import { LINES } from './tags'
import type { LineId, MutationResult } from './types'

function write(lineId: LineId, delta: number): MutationResult {
  if (delta !== 1 && delta !== -1) throw new Error(`허용되지 않은 수량 변경: ${delta}`)
  const written = changeQty(lineId, delta)
  return { qtyAfterWrite: written.qty, writtenAt: written.updatedAt, writtenAtMs: written.updatedAtMs }
}

/**
 * 원본 수량 변경 → updateTag: 태그 엔트리를 즉시 만료.
 * 액션 응답에 페이지의 새 렌더가 실리고, 그 렌더는 stale 값 대신 재계산된 값을 기다려 읽는다.
 */
export async function changeQtyWithUpdateTag(delta: number): Promise<MutationResult> {
  const result = write('update', delta)
  updateTag(LINES.update.tag)
  return result
}

/**
 * 원본 수량 변경 → revalidateTag(tag, 'max'): 태그 엔트리를 stale로 표시만 한다.
 * SWR 갱신이라 액션 응답에 새 렌더가 실리지 않고, 이어지는 첫 요청은 stale 값을 받는다.
 */
export async function changeQtyWithRevalidateTagMax(delta: number): Promise<MutationResult> {
  const result = write('revalidate', delta)
  revalidateTag(LINES.revalidate.tag, 'max')
  return result
}
