import { labelOf, parseCategory, productsOf } from '../data'
import type { Product } from '../data'

type SearchParams = Record<string, string | string[] | undefined>

/** 서버가 받은 searchParams를 URLSearchParams 문자열로 그대로 되돌린다 (예: "?cat=knit"). */
function toSearchString(sp: SearchParams) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(sp)) {
    for (const v of Array.isArray(value) ? value : value === undefined ? [] : [value]) params.append(key, v)
  }
  const s = params.toString()
  return s ? `?${s}` : ''
}

function PaneRows({ items }: { items: Product[] }) {
  return (
    <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {items.map((p) => (
        <li key={p.id} className="flex h-9 items-center justify-between px-2 text-[11px]">
          <span>{p.name}</span>
          <span className="font-mono text-zinc-500">{p.price.toLocaleString('ko-KR')}원</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Page 세그먼트(Server Component). 최상위 article이 Next.js가 scroll 판정에 쓰는 "첫 Page 엘리먼트"다.
 * data-received-search / data-render-id는 서버가 이번 요청에서 받은 값을 그대로 적은 것이다.
 */
export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const received = toSearchString(sp)
  const category = parseCategory(sp.cat)
  const items = productsOf(category)
  const renderId = crypto.randomUUID().slice(0, 8)

  return (
    <article
      data-scroll-page
      data-received-search={received}
      data-render-id={renderId}
      className="space-y-3 pt-3"
    >
      <div className="h-14 rounded border border-zinc-200 bg-zinc-50 p-2 font-mono text-[11px] leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <div>
          서버가 받은 searchParams: <strong className="text-zinc-900 dark:text-zinc-100">{received || '(없음)'}</strong>
        </div>
        <div>서버 렌더 ID: {renderId}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <section className="min-w-0 space-y-1">
          <h2 className="text-[11px] font-semibold">목록 패널 A · key 없음 (보존)</h2>
          <div data-pane="kept" className="h-40 overflow-y-auto rounded border border-zinc-200 dark:border-zinc-800">
            <PaneRows items={items} />
          </div>
        </section>
        <section className="min-w-0 space-y-1">
          <h2 className="text-[11px] font-semibold">목록 패널 B · key={'{cat}'} (초기화)</h2>
          {/* 가이드의 "reset" 쪽 방법: key가 바뀌면 React가 새 DOM 노드를 만든다 */}
          <div
            key={category}
            data-pane="keyed"
            className="h-40 overflow-y-auto rounded border border-zinc-200 dark:border-zinc-800"
          >
            <PaneRows items={items} />
          </div>
        </section>
      </div>

      <section className="space-y-1.5">
        <h2 className="text-xs font-semibold">
          {labelOf(category)} 전체 상품 {items.length}개 <span className="font-normal text-zinc-500">(문서 스크롤 목록)</span>
        </h2>
        <ul className="space-y-1.5">
          {items.map((p) => (
            <li
              key={p.id}
              className="flex h-14 items-center justify-between rounded border border-zinc-200 bg-white px-3 text-xs dark:border-zinc-800 dark:bg-zinc-950"
            >
              <span className="font-medium">{p.name}</span>
              <span className="font-mono text-zinc-500">{p.price.toLocaleString('ko-KR')}원</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
