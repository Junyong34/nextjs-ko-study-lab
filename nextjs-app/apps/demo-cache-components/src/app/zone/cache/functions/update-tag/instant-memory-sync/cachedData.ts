import { cacheTag } from 'next/cache'
import { LINES, nowStamp } from './tags'
import { readSourceLine } from './cartStore'
import type { CachedLine, LineId } from './types'

/**
 * 장바구니 줄 조회 캐시. 본문은 캐시 미스(또는 만료 후 재계산) 때만 실행되므로
 * cacheId·generatedAt·qty는 "이 엔트리가 마지막으로 계산된 순간"의 값이다.
 */
export async function getCachedCartLine(lineId: LineId): Promise<CachedLine> {
  'use cache'
  cacheTag(LINES[lineId].tag)

  const at = nowStamp()
  return {
    qty: readSourceLine(lineId).qty,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: at.label,
    generatedAtMs: at.ms,
  }
}
