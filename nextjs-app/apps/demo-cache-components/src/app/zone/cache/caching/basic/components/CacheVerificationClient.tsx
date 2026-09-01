'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'

interface CacheVerificationClientProps {
  currentCacheId: string
  currentTimestamp: string
  onRevalidate: () => Promise<void>
}

const STORAGE_KEY = 'nextjs_demo_caching_basic_state'

interface CacheSessionState {
  initialCacheId: string
  initialTimestamp: string
  refreshCount: number
  revalidatedAt: string | null
  staleObserved: boolean
  cycleComplete: boolean
  freshCacheId: string | null
}

export function CacheVerificationClient({
  currentCacheId,
  currentTimestamp,
  onRevalidate,
}: CacheVerificationClientProps) {
  const [isPending, startTransition] = useTransition()
  const [session, setSession] = useState<CacheSessionState | null>(null)
  const [actionMessage, setActionMessage] = useState<string>('')

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (!stored) {
        const initial: CacheSessionState = {
          initialCacheId: currentCacheId,
          initialTimestamp: currentTimestamp,
          refreshCount: 0,
          revalidatedAt: null,
          staleObserved: false,
          cycleComplete: false,
          freshCacheId: null,
        }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
        setSession(initial)
      } else {
        const parsed: CacheSessionState = JSON.parse(stored)
        let updated = { ...parsed }

        if (parsed.revalidatedAt) {
          if (currentCacheId === parsed.initialCacheId) {
            // Stale value still observed after invalidation
            updated.staleObserved = true
          } else if (currentCacheId !== parsed.initialCacheId) {
            // Fresh value observed after invalidation!
            updated.cycleComplete = true
            updated.freshCacheId = currentCacheId
          }
        } else {
          // Normal refresh before invalidation
          if (currentCacheId === parsed.initialCacheId) {
            updated.refreshCount += 1
          } else {
            // In case cache naturally expired or changed
            updated.initialCacheId = currentCacheId
            updated.initialTimestamp = currentTimestamp
            updated.refreshCount = 0
          }
        }

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        setSession(updated)
      }
    } catch {
      // Fallback if sessionStorage is disabled
    }
  }, [currentCacheId, currentTimestamp])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleRevalidate = () => {
    startTransition(async () => {
      try {
        await onRevalidate()
        const now = new Date().toLocaleTimeString('ko-KR')
        setActionMessage(`revalidateTag 실행 완료 (${now}). 태그가 stale 상태로 마킹되었습니다.`)

        if (session) {
          const updated: CacheSessionState = {
            ...session,
            revalidatedAt: now,
          }
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
          setSession(updated)
        }
      } catch (err) {
        setActionMessage(`무효화 실패: ${err instanceof Error ? err.message : String(err)}`)
      }
    })
  }

  const handleResetVerification = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    const initial: CacheSessionState = {
      initialCacheId: currentCacheId,
      initialTimestamp: currentTimestamp,
      refreshCount: 0,
      revalidatedAt: null,
      staleObserved: false,
      cycleComplete: false,
      freshCacheId: null,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    setSession(initial)
    setActionMessage('검증 이력이 초기화되었습니다. 새로고침 또는 무효화를 다시 테스트할 수 있습니다.')
  }

  const expectedText =
    '- 일반 브라우저 새로고침: 무효화 전에는 getCachedTimestamp()의 캐시 ID와 시각이 유지됨 (Cache Hit)\n- revalidateTag(tag, "max") 실행: 태그 항목이 stale 상태로 표시되고 첫 재방문 시 백그라운드 revalidation 시작\n- revalidation 완료 뒤 다음 요청: 새로 생성된 캐시 ID와 시각이 표시됨 (Fresh Result)'

  let actualText = ''
  let isMatched: boolean | undefined = undefined

  if (!session) {
    actualText = `• 현재 캐시 고유 ID: #${currentCacheId} (${currentTimestamp})\n• 상태: 초기 캐시 로드 중...`
  } else if (session.cycleComplete) {
    isMatched = true
    actualText = `• 초기 캐시 ID: #${session.initialCacheId} (${session.initialTimestamp})\n• 무효화 후 신규 캐시 ID: #${session.freshCacheId || currentCacheId} (${currentTimestamp})\n• 캐시 수명주기: Stale-While-Revalidate 정상 통과 (초기 유지 → revalidateTag → 신규 캐시 생성)\n• use cache 및 tag 무효화 사이클 검증 완료`
  } else if (session.revalidatedAt) {
    actualText = `• 초기 캐시 ID: #${session.initialCacheId}\n• 현재 캐시 ID: #${currentCacheId}\n• revalidateTag 실행 시각: ${session.revalidatedAt}\n• 상태: ${session.staleObserved ? '1차 재방문에서 Stale 캐시 반환 확인됨. 한 번 더 새로고침하여 Fresh ID 생성을 확인하세요.' : '무효화 요청 완료. [브라우저 새로고침]을 눌러 stale-while-revalidate 전환을 확인하세요.'}`
  } else {
    actualText = `• 초기 캐시 고유 ID: #${session.initialCacheId} (생성: ${session.initialTimestamp})\n• 새로고침 유지 횟수: ${session.refreshCount}회 (캐시 유지 중)\n• revalidateTag 실행: 대기 중\n• 상태: [브라우저 새로고침]으로 캐시 유지를 확인한 후 [캐시 무효화]를 클릭하세요.`
  }

  return (
    <div className="space-y-4">
      {/* 액션 버튼 그룹 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-xs transition hover:bg-zinc-50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <svg
              className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>브라우저 새로고침</span>
          </button>

          <button
            type="button"
            onClick={handleRevalidate}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-amber-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500 cursor-pointer"
          >
            <svg
              className={`h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>{isPending ? '캐시 무효화 중...' : '캐시 무효화 (revalidateTag)'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleResetVerification}
          className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 underline cursor-pointer"
        >
          검증 상태 리셋
        </button>
      </div>

      {actionMessage && (
        <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded border border-amber-200 dark:border-amber-900/60">
          {actionMessage}
        </div>
      )}

      {/* 기대값 vs 실제값 검증 패널 */}
      <ExpectedActualPanel
        title="use cache 캐시 유지 및 revalidateTag revalidation 순서 검증"
        description="새로고침 시 캐시 유지와 revalidateTag(tag, 'max')의 stale-while-revalidate 순서를 대조"
        expected={expectedText}
        actual={actualText}
        isMatched={isMatched}
      />
    </div>
  )
}
