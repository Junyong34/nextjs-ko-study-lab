export default function Page() {
  return (
    <section
      data-slot="preview"
      data-screen="home"
      className="rounded border border-zinc-200 p-3.5 text-sm dark:border-zinc-800"
    >
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">미리보기 요약 (preview 슬롯)</h3>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        재고 요약: 러닝화 42개, 윈드브레이커 18개. 상세 화면을 열어도 이 슬롯만 바뀌는지 확인하라.
      </p>
    </section>
  )
}
