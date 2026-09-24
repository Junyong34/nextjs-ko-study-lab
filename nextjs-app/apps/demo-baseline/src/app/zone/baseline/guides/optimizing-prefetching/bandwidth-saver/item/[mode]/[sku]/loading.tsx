// 기본 prefetch(<Link> prefetch 미지정)가 동적 라우트에서 미리 가져오는 범위의 끝.
export default function ItemLoading() {
  return (
    <div className="animate-pulse space-y-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-3 w-2/3 rounded bg-zinc-100 dark:bg-zinc-900" />
      <p className="text-xs text-zinc-500">상품 정보를 불러오는 중…</p>
    </div>
  )
}
