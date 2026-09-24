import React from 'react'
import { connection } from 'next/server'
import { getCachedPrice } from '../cachedData'
import { readSourcePrice } from '../priceStore'
import { PROFILE_IDS } from '../tags'
import type { ProfileId, RowView } from '../types'
import { PriceWorkbench } from './PriceWorkbench'

/**
 * 요청 시점에 실행 중인 서버의 'use cache' 저장소와 메모리 원본을 함께 읽는다.
 * connection()이 없으면 next build가 이 구간을 정적 HTML로 굳혀, 화면의 cacheId가
 * 운영 서버 캐시가 아니라 빌드 프로세스가 만든 값이 된다.
 */
export async function PriceSection() {
  await connection()
  const entries = await Promise.all(
    PROFILE_IDS.map(async (id) => [id, { cached: await getCachedPrice(id), source: readSourcePrice(id) }] as const),
  )
  return <PriceWorkbench initial={Object.fromEntries(entries) as Record<ProfileId, RowView>} />
}

export function PriceSectionFallback() {
  return (
    <div className="rounded-lg border border-zinc-300 bg-white p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
      가격표 캐시와 원본 버전을 읽는 중...
    </div>
  )
}
