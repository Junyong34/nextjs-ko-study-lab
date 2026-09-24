import React from 'react'
import { connection } from 'next/server'
import { getAllEntries } from '../cachedData'
import { CascadeWorkbench } from './CascadeWorkbench'

/**
 * 엔트리 값을 빌드 시점 프리렌더 HTML이 아니라 요청 시점에 실행 중인 서버의 'use cache' 저장소에서 읽는다.
 * 정적 프리렌더로 두면 화면에는 빌드 프로세스가 만든 값이 보이지만 운영 서버의 캐시에는 그 엔트리가 없어서,
 * 첫 무효화 때 대상과 무관한 엔트리까지 모두 새로 계산되어 전후 비교가 왜곡된다.
 */
export async function CatalogSection() {
  await connection()
  const entries = await getAllEntries()
  return <CascadeWorkbench entries={entries} />
}

export function CatalogSectionFallback() {
  return (
    <div className="rounded-lg border border-zinc-300 bg-white p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
      캐시 엔트리 7개를 읽는 중...
    </div>
  )
}
