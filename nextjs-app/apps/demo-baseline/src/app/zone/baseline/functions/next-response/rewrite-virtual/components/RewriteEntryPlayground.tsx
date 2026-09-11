import Link from 'next/link'

export function RewriteEntryPlayground() {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
          2026 여름 시즌오프 세일 입장 경로 두 가지
        </h4>
        <p className="text-xs text-zinc-500">
          두 링크 모두 결국 같은 실제 파일(<code>target-event/page.tsx</code>)을 렌더링하지만, 브라우저 주소창이
          그대로 유지되는지 여부가 다릅니다. 클릭 후 주소창을 직접 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="?scenario=rewrite"
          className="block rounded-lg border border-teal-300 bg-teal-50/60 p-4 transition-colors hover:bg-teal-100/70 dark:border-teal-800 dark:bg-teal-950/20 dark:hover:bg-teal-950/40"
        >
          <div className="font-mono text-[11px] font-semibold text-teal-700 dark:text-teal-300">
            NextResponse.rewrite()
          </div>
          <div className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">가상 세일 페이지 입장</div>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            주소창은 이 페이지 그대로 유지된 채, 서버 내부에서 실제 이벤트 콘텐츠로 투명하게 연결됩니다.
          </p>
        </Link>

        <Link
          href="?scenario=redirect"
          className="block rounded-lg border border-amber-300 bg-amber-50/60 p-4 transition-colors hover:bg-amber-100/70 dark:border-amber-800 dark:bg-amber-950/20 dark:hover:bg-amber-950/40"
        >
          <div className="font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-300">
            NextResponse.redirect() 대조군
          </div>
          <div className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">레거시 상품 링크로 입장</div>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            같은 이벤트 페이지로 이동하지만, 이번엔 주소창이 실제 목적지 경로로 바뀝니다.
          </p>
        </Link>
      </div>
    </div>
  )
}
