'use client'

import React from 'react'
import { exportPayloadPath, relativePath } from '../lib/products'
import { isServerModeRsc } from '../lib/judge'
import type { RscRequest } from '../types'

const short = (url: string) => url.replace('/zone/baseline/guides/static-exports/client-routing', '…')

export function RscRequestTable({ requests }: { requests: RscRequest[] }) {
  if (requests.length === 0) {
    return <p className="text-xs text-zinc-500">아직 기록된 RSC 요청이 없습니다. 위의 링크로 이동해 보세요.</p>
  }
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-[11px]">
        <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
          <tr>
            <th className="py-1.5 pr-2 font-medium">#</th>
            <th className="py-1.5 pr-2 font-medium">요청 URL (실측)</th>
            <th className="py-1.5 pr-2 font-medium">rsc 헤더</th>
            <th className="py-1.5 pr-2 font-medium">응답 (실측)</th>
            <th className="py-1.5 font-medium">export 빌드였다면 (소스 규칙 계산)</th>
          </tr>
        </thead>
        <tbody className="font-mono">
          {requests.map((r) => (
            <tr key={r.seq} className="border-b border-zinc-100 align-top dark:border-zinc-900">
              <td className="py-1.5 pr-2">{r.seq}</td>
              <td className="break-all py-1.5 pr-2">
                {short(r.url)}
                <span className="block font-sans text-zinc-500">{r.kind === 'prefetch' ? 'prefetch' : '탐색'} · {relativePath(r.pathname)}</span>
              </td>
              <td className="py-1.5 pr-2">{r.rscHeader ?? '없음'}</td>
              <td className={`py-1.5 pr-2 ${isServerModeRsc(r) ? 'text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}>
                {r.error ? `실패: ${r.error}` : `${r.status} · ${r.contentType ?? 'content-type 없음'}`}
              </td>
              <td className="break-all py-1.5 text-zinc-500">
                {r.kind === 'navigation' ? short(exportPayloadPath(r.pathname)) : '세그먼트 prefetch 파일 (생략)'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
