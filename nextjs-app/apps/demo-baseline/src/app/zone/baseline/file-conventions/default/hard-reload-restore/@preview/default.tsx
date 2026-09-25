export default function Default() {
  return (
    <section
      data-slot="preview"
      data-screen="default"
      className="rounded border border-amber-400 bg-amber-50/60 p-3.5 text-sm dark:border-amber-700 dark:bg-amber-950/20"
    >
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">미리보기 기본 화면</h3>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        preview 슬롯에 현재 URL과 일치하는 하위 페이지가 없을 때의 대비용 <code>default.tsx</code>다. 이
        실습에서는 preview 슬롯의 두 경로가 모두 매칭되므로 평소에는 나타나지 않는다.
      </p>
    </section>
  )
}
