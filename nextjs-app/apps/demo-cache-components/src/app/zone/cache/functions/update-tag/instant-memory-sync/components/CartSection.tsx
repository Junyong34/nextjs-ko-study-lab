import React from 'react'
import { connection } from 'next/server'
import { getCachedCartLine } from '../cachedData'
import { readSourceLine } from '../cartStore'
import { LINES, LINE_IDS } from '../tags'
import type { CartLineSnapshot } from '../types'
import { CartWorkbench } from './CartWorkbench'

/**
 * 요청 시점에 실행 중인 서버의 'use cache' 저장소와 메모리 원본을 함께 읽는다.
 * connection()이 없으면 next build가 이 구간을 정적 HTML로 굳혀서, 화면의 cacheId가
 * 운영 서버 캐시가 아니라 빌드 프로세스가 만든 값이 되어 전후 비교가 무의미해진다.
 */
export async function CartSection() {
  await connection()
  const lines: CartLineSnapshot[] = await Promise.all(
    LINE_IDS.map(async (lineId) => ({
      lineId,
      ...LINES[lineId],
      cached: await getCachedCartLine(lineId),
      source: readSourceLine(lineId),
    })),
  )
  return <CartWorkbench lines={lines} />
}

export function CartSectionFallback() {
  return (
    <div className="rounded-lg border border-zinc-300 bg-white p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
      장바구니 캐시와 원본 수량을 읽는 중...
    </div>
  )
}
