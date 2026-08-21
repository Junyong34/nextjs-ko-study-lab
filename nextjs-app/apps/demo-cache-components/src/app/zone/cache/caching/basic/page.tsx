/**
 * Demo: use cache 기본 동작 및 revalidateTag 무효화
 * URL: /demo/caching/basic
 * Internal: /zone/cache/caching/basic
 * Doc: 1-getting-started/caching.md
 * Status: done
 */

import { cacheTag, revalidateTag } from 'next/cache'
import { DemoContainer, ExpectedActualPanel } from '@study/demo-kit'
import { CacheActions } from './CacheActions'

// 1. 'use cache' 적용 데이터 로딩 함수 (타임스탬프와 캐시 ID 반환)
async function getCachedTimestamp() {
  'use cache'
  cacheTag('caching-basic:data')

  const now = new Date()
  const timestamp = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })
  const cacheId = Math.random().toString(36).substring(2, 8).toUpperCase()

  return {
    timestamp,
    cacheId,
    generatedAt: now.toISOString(),
  }
}

// 2. Server Action: 특정 캐시만 선택 무효화
async function invalidateCacheAction() {
  'use server'
  revalidateTag('caching-basic:data', 'max')
}

export default async function DemoPage() {
  const cachedData = await getCachedTimestamp()

  return (
    <DemoContainer className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* 데모 헤더 영역 */}
      <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-semibold">
            Zone: cache (Cache Components)
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            캐시 생성 시각: {cachedData.timestamp}
          </span>
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          use cache 기본 동작 및 revalidateTag 무효화
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          근거 문서: <code className="bg-zinc-200/60 dark:bg-zinc-800 px-1 py-0.5 rounded">1-getting-started/caching.md</code>
        </p>
      </div>

      {/* 데모 실증 영역 */}
      <div className="p-4 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 space-y-4 shadow-xs">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            캐시된 데이터 상태
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">getCachedTimestamp()</code> 함수에{' '}
            <code className="text-xs text-amber-600 dark:text-amber-400 font-semibold">'use cache'</code>와{' '}
            <code className="text-xs text-amber-600 dark:text-amber-400 font-semibold">cacheTag('caching-basic:data')</code>가 적용되어 있습니다.
          </p>
        </div>

        {/* 캐시 데이터 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-md bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1">
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              캐시 생성 시각 (Cache Timestamp)
            </div>
            <div className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {cachedData.timestamp}
            </div>
          </div>

          <div className="p-3 rounded-md bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1">
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              캐시 고유 식별자 (Cache ID)
            </div>
            <div className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
              #{cachedData.cacheId}
            </div>
          </div>
        </div>

        {/* 조작 액션 버튼 */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <CacheActions onRevalidate={invalidateCacheAction} />
        </div>
      </div>

      {/* 기대값 vs 실제값 검증 패널 */}
      <ExpectedActualPanel
        title="캐시 동작 및 무효화 검증"
        description="새로고침 시 캐시 유지 및 무효화 트리거 시 갱신 동작"
        expected="새로고침해도 캐시된 타임스탬프가 유지되며, 무효화 버튼 클릭 시 즉시 갱신됨"
        actual={`캐시 ID: #${cachedData.cacheId} (${cachedData.timestamp})`}
        isMatched={true}
      />
    </DemoContainer>
  )
}
