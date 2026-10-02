'use client'
import React from 'react'
import { useCacheSnapshot } from '../hooks/useCacheSnapshot'

/** 공지사항 화면에서 보는 QueryCache 상태. 목록 컴포넌트가 없으니 observer는 0이어야 한다. */
export function CacheStatus() {
  const snap = useCacheSnapshot()
  return (
    <div className="space-y-3 text-sm">
      <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
        <div className="font-bold text-zinc-900 dark:text-zinc-100">배송 일정 안내</div>
        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          이 화면에는 상품 목록 컴포넌트가 없습니다. 상단 [상품 목록]으로 돌아가 목록이 로딩 화면 없이 바로 나타나는지 확인하세요.
        </p>
      </div>
      <div className="rounded border border-zinc-800 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">
        {snap ? (
          <>
            <div>observer(구독 컴포넌트) 수: <span className="font-bold text-amber-300">{snap.observers}</span></div>
            <div>캐시에 남은 페이지: <span className="font-bold text-emerald-400">{snap.pages}</span>개 · 상품 {snap.items}개</div>
            <div>마지막 갱신 후 지난 시간은 목록으로 돌아갈 때 staleTime(60초)과 비교됩니다.</div>
          </>
        ) : (
          <div className="text-zinc-500">QueryCache를 읽는 중...</div>
        )}
      </div>
    </div>
  )
}
