export default function Default() {
  return (
    <section
      data-slot="children"
      data-screen="default"
      className="rounded border border-amber-400 bg-amber-50/60 p-3.5 text-sm dark:border-amber-700 dark:bg-amber-950/20"
    >
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">메인 기본 화면 (복구됨)</h3>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        현재 URL과 일치하는 <code>page.tsx</code>가 <code>children</code> 슬롯에 없어, 이 라우트 세그먼트의{' '}
        <code>default.tsx</code>가 대신 렌더링됐다. 새로고침(하드 리로드) 직후에만 나타난다.
      </p>
    </section>
  )
}
