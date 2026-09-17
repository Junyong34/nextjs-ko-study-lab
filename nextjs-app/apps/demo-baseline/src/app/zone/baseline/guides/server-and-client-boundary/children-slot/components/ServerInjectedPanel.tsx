export interface ServerInjectedPanelProps {
  renderId: string
  generatedAt: string
}

export function ServerInjectedPanel({ renderId, generatedAt }: ServerInjectedPanelProps) {
  return (
    <div className="rounded border border-blue-300 bg-blue-50/40 p-4 dark:border-blue-900 dark:bg-blue-950/20 space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-blue-950 dark:text-blue-200">children으로 주입된 Server Component</span>
        <span className="font-mono text-[10px] text-zinc-400">renderId: {renderId}</span>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        {generatedAt}에 서버에서 렌더링된 결과입니다. 이 파일에는 <code>&apos;use client&apos;</code>가 없으므로 클라이언트 번들에 포함되지 않습니다.
      </p>
    </div>
  )
}
