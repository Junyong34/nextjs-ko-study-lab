'use client'

import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import type { AssetScan } from '../types'

interface Props {
  scan: AssetScan | null
  onScan: () => void
  onReset: () => void
}

export function AssetScanSection({ scan, onScan, onReset }: Props) {
  return (
    <section className="min-w-0 space-y-3" aria-label="현재 설정 실측">
      <h3 className="font-semibold">1. 현재 설정 실측 — Next가 만든 자산 태그</h3>
      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
        이 페이지 문서에서 <code>/_next/static</code> 아래의 태그를 두 무리로 나눠 <code>crossorigin</code> 속성을 셉니다.
        부트스트랩 <code>&lt;script defer&gt;</code>·CSS <code>&lt;link&gt;</code>는 next.config의 <code>crossOrigin</code> 값이 그대로
        전달되는 태그이고, <code>&lt;script async&gt;</code>는 client 컴포넌트 청크를 React Flight가 넣은 태그입니다.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onScan}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          문서 태그 검사
        </button>
        <DemoResetButton label="검사 결과 초기화" onReset={onReset} />
      </div>
      {scan ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded border border-zinc-200 p-3 font-mono text-[11px] dark:border-zinc-800">
          <dt className="text-zinc-500">부트스트랩 defer·link</dt>
          <dd>{scan.bootstrap.total}개 중 crossorigin {scan.bootstrap.withCrossOrigin.length}개</dd>
          <dt className="text-zinc-500">Flight 청크 async</dt>
          <dd>
            {scan.chunks.total}개 중 crossorigin {scan.chunks.withCrossOrigin.length}개
            {scan.chunks.withCrossOrigin[0] ? ` (값 "${scan.chunks.withCrossOrigin[0].value}")` : ''}
          </dd>
          <dt className="text-zinc-500">측정 시각</dt>
          <dd>{scan.scannedAt.slice(11, 23)}Z</dd>
        </dl>
      ) : (
        <p className="text-xs text-zinc-500">아직 검사하지 않았습니다.</p>
      )}
    </section>
  )
}
