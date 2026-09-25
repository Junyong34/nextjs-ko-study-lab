'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import type { BootSnapshotResponse, ServerBootLogSnapshot } from '../types'
import { VerificationFooter } from './VerificationFooter'

const API_ENDPOINT = '/zone/baseline/file-conventions/instrumentation/server-boot-log/api/boot-snapshot'

export interface InstrumentationServerLogDemoProps {
  /** page.tsx(Server Component)가 렌더링 시점에 직접 읽은 부팅 스냅샷 */
  initialSnapshot: ServerBootLogSnapshot
}

function formatUptime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}분 ${seconds}초`
}

export function InstrumentationServerLogDemo({ initialSnapshot }: InstrumentationServerLogDemoProps) {
  const router = useRouter()
  const [now, setNow] = useState<number | null>(null)
  const [fetchedSnapshot, setFetchedSnapshot] = useState<BootSnapshotResponse | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // 가동 시간은 클라이언트에서만 흐르므로 useEffect에서 초기화 — SSR/클라이언트 hydration mismatch 방지.
  useEffect(() => {
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const handleFetchSnapshot = async () => {
    setIsFetching(true)
    setFetchError(null)
    try {
      const res = await fetch(API_ENDPOINT, { cache: 'no-store' })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? `HTTP ${res.status}`)
      }
      const data: BootSnapshotResponse = await res.json()
      setFetchedSnapshot(data)
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsFetching(false)
    }
  }

  const handleServerRefresh = () => {
    setIsRefreshing(true)
    router.refresh()
    window.setTimeout(() => setIsRefreshing(false), 500)
  }

  const handleResetLog = () => {
    setFetchedSnapshot(null)
    setFetchError(null)
  }

  const uptimeMs = now !== null ? now - initialSnapshot.bootedAtMs : null

  return (
    <>
      <DemoPlaygroundCard title="서버 부팅 스냅샷 (실제 파일: src/instrumentation.ts register())">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              register()는 이 dev 서버 프로세스가 최초 기동될 때 1회 실행됐다. 아래 좌측 값은 이 페이지가
              서버에서 렌더링될 때마다 새로 읽지만, register()가 다시 실행되지 않는 한 값은 절대 바뀌지 않는다.
            </p>
            <div className="flex items-center gap-2">
              {uptimeMs !== null && (
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  프로세스 가동 {formatUptime(uptimeMs)}
                </span>
              )}
              <DemoResetButton onReset={handleResetLog} label="API 호출 기록 초기화" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3.5 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="font-sans text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                SSR 렌더 시 읽은 값 (page.tsx)
              </div>
              <SnapshotRow label="bootedAt" value={initialSnapshot.bootedAt} />
              <SnapshotRow label="runtime" value={initialSnapshot.runtime} />
              <SnapshotRow label="pid" value={String(initialSnapshot.pid)} />
              <SnapshotRow label="nodeVersion" value={initialSnapshot.nodeVersion} />
              <SnapshotRow label="registerCallCount" value={String(initialSnapshot.registerCallCount)} />
            </div>

            <div className="space-y-2 rounded border border-zinc-800 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300">
              <div className="font-sans text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                GET /api/boot-snapshot 응답
              </div>
              {fetchedSnapshot ? (
                <>
                  <SnapshotRow
                    label="bootedAt"
                    value={fetchedSnapshot.bootedAt}
                    dark
                    highlight={fetchedSnapshot.bootedAt === initialSnapshot.bootedAt}
                  />
                  <SnapshotRow
                    label="registerCallCount"
                    value={String(fetchedSnapshot.registerCallCount)}
                    dark
                    highlight={fetchedSnapshot.registerCallCount === initialSnapshot.registerCallCount}
                  />
                  <SnapshotRow label="requestReceivedAt" value={fetchedSnapshot.requestReceivedAt} dark />
                  <SnapshotRow label="requestCount(누적)" value={String(fetchedSnapshot.requestCount)} dark />
                </>
              ) : (
                <div className="text-zinc-500">[서버에 요청 보내기]를 눌러 실제 API 응답을 확인하세요.</div>
              )}
              {fetchError && <div className="text-rose-400">오류: {fetchError}</div>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={handleFetchSnapshot}
              disabled={isFetching}
              className="cursor-pointer rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {isFetching ? '요청 중...' : '서버에 요청 보내기 (GET /api/boot-snapshot)'}
            </button>
            <button
              type="button"
              onClick={handleServerRefresh}
              disabled={isRefreshing}
              className="cursor-pointer rounded border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {isRefreshing ? '새로고침 중...' : 'router.refresh()로 서버 렌더 재요청'}
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
            브라우저를 완전히 새로고침(F5)해도 좌측 SSR 값의 bootedAt·registerCallCount는 그대로다 — dev 서버
            프로세스를 재시작하기 전까지 register()는 다시 호출되지 않기 때문이다.
          </p>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter ssrSnapshot={initialSnapshot} fetchedSnapshot={fetchedSnapshot} />
    </>
  )
}

function SnapshotRow({
  label,
  value,
  dark,
  highlight,
}: {
  label: string
  value: string
  dark?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-zinc-500 dark:text-zinc-500">{label}</span>
      <span
        className={`truncate ${
          highlight
            ? 'font-bold text-emerald-500'
            : dark
            ? 'text-zinc-200'
            : 'text-zinc-900 dark:text-zinc-100'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
