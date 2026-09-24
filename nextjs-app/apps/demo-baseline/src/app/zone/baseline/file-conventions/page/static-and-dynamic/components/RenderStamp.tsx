import React from 'react'

/**
 * 이 컴포넌트가 "서버에서 실행된 순간"의 시각과 무작위 ID를 그린다.
 * 정적 page라면 next build 때 한 번 실행된 값이 HTML에 고정되고, 동적 page라면 요청마다 새로 실행된다.
 * data-* 속성은 RequestProbe가 fetch한 HTML에서 값을 읽어 가는 표식이다.
 */
export function RenderStamp({ file, api, extra }: { file: string; api: string; extra?: React.ReactNode }) {
  const renderedAt = new Date().toISOString()
  const renderId = crypto.randomUUID().slice(0, 8)

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <code className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{file}</code>
        <span className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
          {api}
        </span>
      </div>
      <dl
        className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[11px]"
        data-render-id={renderId}
        data-rendered-at={renderedAt}
      >
        <dt className="text-zinc-500">서버 렌더 시각</dt>
        <dd className="text-zinc-900 dark:text-zinc-100">{renderedAt}</dd>
        <dt className="text-zinc-500">렌더 ID</dt>
        <dd className="font-bold text-blue-700 dark:text-blue-300">{renderId}</dd>
      </dl>
      {extra && <div className="mt-2 text-[11px] text-zinc-600 dark:text-zinc-400">{extra}</div>}
    </div>
  )
}
