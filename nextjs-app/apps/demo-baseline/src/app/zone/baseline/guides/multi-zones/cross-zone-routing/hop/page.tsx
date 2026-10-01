import Link from 'next/link'
import { ARRIVAL_PATH, CACHE_PAGE_PATH } from '../lib/zone'

const btn = 'rounded border border-zinc-300 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800'

// iframe 안에서 열리는 출발 화면. 같은 목적지로 <Link>와 <a>를 나란히 둔다.
// data-hop-kind는 바깥 실습 화면이 "어떤 링크를 눌렀는지" 기록하는 데만 쓴다.
export default function HopPage() {
  return (
    <main data-hop-screen="hop" className="space-y-3 p-4 text-sm">
      <p className="font-bold">출발: baseline zone (hop)</p>
      <div className="flex flex-wrap gap-2">
        <Link href={ARRIVAL_PATH} data-hop-kind="link-same" className={btn}>&lt;Link&gt; 같은 zone</Link>
        <a href={ARRIVAL_PATH} data-hop-kind="a-same" className={btn}>&lt;a&gt; 같은 zone</a>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={CACHE_PAGE_PATH} data-hop-kind="link-cross" className={btn}>&lt;Link&gt; cache zone으로</Link>
        <a href={CACHE_PAGE_PATH} data-hop-kind="a-cross" className={btn}>&lt;a&gt; cache zone으로</a>
      </div>
    </main>
  )
}
