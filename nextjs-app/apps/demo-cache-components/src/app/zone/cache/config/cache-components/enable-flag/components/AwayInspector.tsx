'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { AwayObservation } from '../types'
import { inspectHiddenLab } from '../lib/activityStore'
import { DEMO_PATH } from '../lib/routes'

/** away 페이지가 마운트된 직후, 문서에 남아 있는 이전 라우트(실습 화면) DOM을 조사한다 */
export function AwayInspector() {
  const [obs, setObs] = useState<AwayObservation | null>(null)

  useEffect(() => {
    setObs(inspectHiddenLab())
  }, [])

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950">
      <ul className="space-y-1 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
        <li>이전 라우트의 실습 영역 DOM: {obs ? (obs.foundLab ? '문서에 남아 있음' : '없음 (언마운트됨)') : '조사 중…'}</li>
        <li>숨김 방식: {obs ? (obs.hiddenByDisplayNone ? 'display: none (Activity hidden)' : '숨김 아님') : '-'}</li>
        <li>숨겨진 입력창의 값: {obs?.draftSeen ? `"${obs.draftSeen}"` : '-'}</li>
        <li>숨겨진 컴포넌트 인스턴스 ID: {obs?.instanceId ?? '-'}</li>
      </ul>
      <Link
        href={DEMO_PATH}
        className="inline-block rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
      >
        실습 화면으로 돌아가기
      </Link>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
        브라우저 뒤로 가기로 돌아가도 같은 결과를 볼 수 있습니다. 이 페이지에서 새로고침하면 클라이언트 상태가 모두 사라집니다.
      </p>
    </div>
  )
}
