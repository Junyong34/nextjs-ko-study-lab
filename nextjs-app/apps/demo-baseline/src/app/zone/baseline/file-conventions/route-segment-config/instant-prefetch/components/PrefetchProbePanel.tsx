'use client'
import React from 'react'
import Link from 'next/link'
import type { ProbeCase, ProbeResult } from '../types'

export interface PrefetchProbePanelProps {
  results: ProbeResult[]
  isLoading: ProbeCase | null
  onRun: (probeCase: ProbeCase) => void
  detailHref: string
}

export function PrefetchProbePanel({ results, isLoading, onRun, detailHref }: PrefetchProbePanelProps) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
          이 페이지 자신에게 실제 fetch() 요청 보내기
        </h4>
        <p className="text-xs text-zinc-500">
          현재 URL(<code className="font-mono">window.location.pathname</code>)에 브라우저가 실제로
          fetch를 보냅니다. 하나는 일반 문서 요청, 다른 하나는 Next.js의 <code>{'<Link>'}</code>가
          프리페치할 때 실제로 붙이는 <code>RSC</code>/<code>Next-Router-Prefetch</code> 헤더를
          그대로 실은 요청입니다. 응답을 흉내 낸 값이 아니라 서버가 실제로 돌려준 상태 코드·헤더를
          그대로 표시합니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onRun('normal')}
          disabled={isLoading !== null}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          {isLoading === 'normal' ? '요청 중...' : '① 일반 요청 실행 (헤더 없음)'}
        </button>
        <button
          onClick={() => onRun('rsc-prefetch')}
          disabled={isLoading !== null}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
        >
          {isLoading === 'rsc-prefetch' ? '요청 중...' : '② RSC 프리페치 신호 요청 실행'}
        </button>
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-[11px] text-zinc-300 dark:border-zinc-800 space-y-1.5">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
          실제 fetch() 응답 로그 (최근 6건):
        </div>
        {results.length === 0 && (
          <div className="text-zinc-500">위 버튼을 눌러 실제 요청을 보내면 여기에 기록됩니다.</div>
        )}
        {results.map((r) => (
          <div key={r.id} className="text-emerald-400">
            [{r.fetchedAt}] {r.probeCase === 'normal' ? '일반 요청' : 'RSC 프리페치 신호 요청'} →
            status={r.status} redirected={String(r.redirected)} content-type=
            {r.contentType ?? '(none)'}
          </div>
        ))}
      </div>

      <div className="border-t pt-3 dark:border-zinc-800">
        <p className="mb-2 text-xs text-zinc-500">
          실제 Next.js <code>{'<Link>'}</code>로 실제 서브 라우트로 이동해보기 (탭 전환이 아니라
          진짜 클라이언트 사이드 전환입니다):
        </p>
        <Link
          href={detailHref}
          className="inline-block rounded border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
        >
          상품 상세로 이동 →
        </Link>
      </div>
    </div>
  )
}
