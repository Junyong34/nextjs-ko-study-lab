export default function TargetLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-3 p-6 font-sans text-xs text-zinc-500 dark:text-zinc-400">
      <div className="animate-pulse rounded border border-zinc-200 bg-zinc-100 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        실시간 재고 확인 중...
      </div>
      <p>
        이 화면은 <code>target/loading.tsx</code>입니다. <code>prefetch=&quot;auto&quot;</code>(기본값) 링크가 부분
        prefetch할 때 실제로 미리 받아오는 대상이 바로 이 로딩 스켈레톤입니다 — 아래 상품 목록(동적 데이터)은 포함되지
        않습니다.
      </p>
    </div>
  )
}
