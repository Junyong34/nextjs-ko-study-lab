export function CsrfBoundaryGuide() {
  return (
    <div className="rounded border border-blue-200 bg-blue-50/60 p-3 text-sm dark:border-blue-900 dark:bg-blue-950/20">
      <p className="font-semibold text-zinc-900 dark:text-zinc-100">이 화면에서 확인하는 범위</p>
      <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400">
        위 버튼은 현재 페이지에서 실제 Server Action POST를 보냅니다. 아래 검증 패널에서 서버가 받은 출처 헤더와 액션 도달 여부를 확인하세요.
      </p>
      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded border border-emerald-200 bg-white p-2 dark:border-emerald-900 dark:bg-zinc-950">
          <p className="font-semibold text-emerald-700 dark:text-emerald-400">같은 출처</p>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Origin과 Host가 맞으면 액션 함수가 실행되고, 서버가 읽은 헤더를 반환합니다.</p>
        </div>
        <div className="rounded border border-amber-200 bg-white p-2 dark:border-amber-900 dark:bg-zinc-950">
          <p className="font-semibold text-amber-700 dark:text-amber-400">다른 출처</p>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Origin이 다르면 Next.js가 액션 함수보다 먼저 요청을 중단합니다. 이 화면은 그 차단을 성공처럼 꾸미지 않습니다.</p>
        </div>
      </div>
    </div>
  )
}
