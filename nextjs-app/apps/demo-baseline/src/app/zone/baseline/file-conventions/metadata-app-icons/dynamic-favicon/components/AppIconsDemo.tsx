'use client'
import React from 'react'
import Link from 'next/link'
import { DemoResetButton } from '@study/demo-kit'
import { useIconProbe } from '../hooks/useIconProbe'
import { SEGMENT_PATH } from '../specs'
import { IconProbeCard } from './IconProbeCard'
import { VerificationFooter } from './VerificationFooter'

export function AppIconsDemo() {
  const { snapshot, isMeasuring, measure, reset } = useIconProbe()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={measure}
              disabled={isMeasuring}
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-zinc-700 disabled:opacity-50 cursor-pointer dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {isMeasuring ? '측정 중...' : 'head 아이콘 링크 읽고 fetch'}
            </button>
            <span className="text-zinc-500">
              {snapshot
                ? `${snapshot.measuredAt} 측정 · 링크 ${snapshot.icons.length}개`
                : '아직 측정하지 않았습니다.'}
            </span>
          </div>
          <DemoResetButton onReset={reset} />
        </div>

        {snapshot ? (
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              이 페이지 문서에 주입된 아이콘 링크 → 실제 응답
            </h5>
            {snapshot.icons.length === 0 ? (
              <p className="rounded-md border border-rose-300 p-3 text-xs text-rose-700 dark:border-rose-800 dark:text-rose-300">
                문서에서 rel=&quot;icon&quot; / rel=&quot;apple-touch-icon&quot; 링크를 찾지 못했습니다.
              </p>
            ) : (
              snapshot.icons.map((icon) => <IconProbeCard key={icon.link.href} icon={icon} />)
            )}

            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-[11px] dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                비교: <span className="font-mono">{SEGMENT_PATH}/no-reset</span> HTML의 아이콘 링크
              </div>
              {snapshot.noResetLinks ? (
                <ul className="space-y-0.5 font-mono text-zinc-700 dark:text-zinc-300">
                  {snapshot.noResetLinks.map((l) => (
                    <li key={`${l.rel}-${l.href}`} className="break-all">
                      {`<link rel="${l.rel}" href="${l.href}"${l.sizes ? ` sizes="${l.sizes}"` : ''}${l.type ? ` type="${l.type}"` : ''}>`}
                    </li>
                  ))}
                  {snapshot.noResetLinks.length === 0 ? <li>(아이콘 링크 없음)</li> : null}
                </ul>
              ) : (
                <p className="text-rose-600">측정 실패: {snapshot.noResetError}</p>
              )}
              <Link
                href={`${SEGMENT_PATH}/no-reset`}
                className="mt-2 inline-block font-semibold text-zinc-900 underline dark:text-zinc-100"
              >
                no-reset 페이지 열기
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      <VerificationFooter snapshot={snapshot} />
    </div>
  )
}
