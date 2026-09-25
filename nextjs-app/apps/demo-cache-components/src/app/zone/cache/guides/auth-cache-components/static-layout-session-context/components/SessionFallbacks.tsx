/** static shell에 함께 들어가는 fallback — 실제 위젯과 같은 크기로 CLS를 막는다. */
export function BadgeFallback() {
  return (
    <div data-demo-marker="session-fallback" className="space-y-1 text-right" aria-busy="true">
      <div className="ml-auto h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="ml-auto h-3 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
    </div>
  )
}

export function AccountPanelFallback() {
  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800" aria-busy="true">
      <div className="h-4 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-16 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
      <div className="h-7 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
    </div>
  )
}

export function StoreFallback() {
  return (
    <div className="h-64 animate-pulse rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60" />
  )
}
