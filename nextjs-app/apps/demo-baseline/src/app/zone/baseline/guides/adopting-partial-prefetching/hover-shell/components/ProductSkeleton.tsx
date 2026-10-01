export function ProductSkeleton({ label }: { label: string }) {
  return (
    <div className="space-y-2 rounded-md border border-dashed border-zinc-300 p-3 text-xs dark:border-zinc-700" data-skeleton={label}>
      <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <span className="text-[10px] text-zinc-500">{label}: 동적 데이터가 도착하기 전 표시되는 자리</span>
    </div>
  )
}
