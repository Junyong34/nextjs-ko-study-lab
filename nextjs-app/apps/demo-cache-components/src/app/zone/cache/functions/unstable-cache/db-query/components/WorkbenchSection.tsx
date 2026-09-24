import React from 'react'
import { connection } from 'next/server'
import { snapshot } from '../db'
import { DbQueryWorkbench } from './DbQueryWorkbench'

/**
 * DB 테이블·쿼리 카운터는 빌드 시점이 아니라 요청 시점에 실행 중인 서버 프로세스의 값을 읽어야 한다.
 * connection()으로 요청 시점 렌더를 강제하고, 캐시 함수 호출은 모두 Server Action에서 한다
 * (페이지 렌더 중에 호출하면 cacheComponents 프리렌더가 결과를 정적 셸에 굳혀 측정이 왜곡된다).
 */
export async function WorkbenchSection() {
  await connection()
  return <DbQueryWorkbench initialSnapshot={snapshot()} />
}

export function WorkbenchSectionFallback() {
  return (
    <div className="rounded-lg border border-zinc-300 bg-white p-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
      DB 상태를 읽는 중...
    </div>
  )
}
