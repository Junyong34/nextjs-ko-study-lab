import React from 'react'
import type { MeasuredIcon } from '../types'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-2">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="break-all font-mono text-zinc-800 dark:text-zinc-200">{value}</dd>
    </div>
  )
}

export function IconProbeCard({ icon }: { icon: MeasuredIcon }) {
  const { link, pathname, query, result } = icon
  const dims = result.naturalWidth !== null ? `${result.naturalWidth} x ${result.naturalHeight}px` : '-'

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-3 text-[11px] dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row">
      <div className="flex h-[196px] w-full shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-100 sm:w-[196px] dark:border-zinc-700 dark:bg-zinc-900">
        {result.previewUrl ? (
          <img
            src={result.previewUrl}
            alt={`${link.rel} ${link.sizes ?? ''} 미리보기`}
            width={result.naturalWidth ?? undefined}
            height={result.naturalHeight ?? undefined}
          />
        ) : (
          <span className="text-zinc-500">{result.error ?? '미리보기 없음'}</span>
        )}
      </div>
      <dl className="min-w-0 flex-1 space-y-1">
        <Row label="rel" value={link.rel} />
        <Row label="위치" value={link.inHead ? 'document.head' : 'body'} />
        <Row label="href 경로" value={pathname} />
        <Row label="href 쿼리" value={query || '(없음)'} />
        <Row label="sizes 속성" value={link.sizes ?? '(없음)'} />
        <Row label="type 속성" value={link.type ?? '(없음)'} />
        <div className="my-1.5 border-t border-zinc-200 dark:border-zinc-800" />
        <Row label="응답 status" value={result.status ?? `오류: ${result.error}`} />
        <Row label="Content-Type" value={result.contentType ?? '-'} />
        <Row label="Cache-Control" value={result.cacheControl ?? '-'} />
        <Row label="x-nextjs-cache" value={result.nextCache ?? '(없음)'} />
        <Row label="바이트" value={result.byteLength ?? '-'} />
        <Row label="naturalSize" value={dims} />
      </dl>
    </div>
  )
}
