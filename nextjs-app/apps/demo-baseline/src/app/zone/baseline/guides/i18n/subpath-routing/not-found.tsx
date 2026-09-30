/** [lang] layout의 notFound()를 이 데모의 layout 안에서 받아 404 결과를 보여준다. */
export default function SubpathNotFound() {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
      <strong>404</strong> — 지원하지 않는 언어 세그먼트입니다. hasLocale(lang)이 false여서 notFound()가 호출됐습니다.
    </div>
  )
}
