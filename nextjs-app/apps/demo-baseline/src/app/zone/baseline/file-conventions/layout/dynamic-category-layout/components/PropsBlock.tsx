import React from 'react'

/** 서버 컴포넌트가 실제로 받은 값을 그대로 보여 주는 작은 표 (Server/Client 공용) */
export function PropsBlock({ title, rows }: { title: string; rows: [string, React.ReactNode][] }) {
  return (
    <div className="min-w-0 rounded border border-zinc-200 bg-zinc-50 p-2.5 text-[11px] dark:border-zinc-800 dark:bg-zinc-900/60">
      <p className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">{title}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
        {rows.map(([k, v]) => (
          <React.Fragment key={k}>
            <dt className="text-zinc-500">{k}</dt>
            <dd className="min-w-0 break-all font-mono text-zinc-800 dark:text-zinc-200">{v}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  )
}
