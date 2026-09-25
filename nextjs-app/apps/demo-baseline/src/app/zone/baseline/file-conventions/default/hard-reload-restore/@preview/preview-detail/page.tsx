export default function Page() {
  return (
    <section
      data-slot="preview"
      data-screen="detail"
      className="rounded border border-blue-400 bg-blue-50/60 p-3.5 text-sm dark:border-blue-700 dark:bg-blue-950/20"
    >
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">미리보기 상세</h3>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        재고 상세: 러닝화 재입고 예정 9/28, 윈드브레이커 품절 임박. 이 화면은{' '}
        <code>@preview/preview-detail/page.tsx</code>가 렌더링하며, <code>preview-detail</code> 세그먼트는{' '}
        <code>@preview</code> 슬롯 전용이라 URL에는 슬롯 이름 없이 <code>/preview-detail</code>로만 나타난다.
      </p>
    </section>
  )
}
