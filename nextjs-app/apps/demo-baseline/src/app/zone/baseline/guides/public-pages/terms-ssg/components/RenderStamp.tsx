import React from 'react'

/**
 * 이 컴포넌트가 "서버에서 실행된 순간"의 시각과 무작위 ID를 그린다.
 * ● page라면 next build 때 한 번 실행된 값이 HTML에 고정되고, ƒ page라면 요청마다 새로 실행된다.
 * data-* 속성은 RequestProbe가 fetch한 HTML에서 값을 읽어 가는 표식이다.
 */
export function RenderStamp({ file }: { file: string }) {
  const renderedAt = new Date().toISOString()
  const renderId = crypto.randomUUID().slice(0, 8)

  return (
    <dl
      className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-900/60"
      data-render-id={renderId}
      data-rendered-at={renderedAt}
    >
      <dt className="text-zinc-500">파일</dt>
      <dd className="text-zinc-900 dark:text-zinc-100">{file}</dd>
      <dt className="text-zinc-500">서버 렌더 시각</dt>
      <dd className="text-zinc-900 dark:text-zinc-100">{renderedAt}</dd>
      <dt className="text-zinc-500">렌더 ID</dt>
      <dd className="font-bold text-blue-700 dark:text-blue-300">{renderId}</dd>
    </dl>
  )
}
