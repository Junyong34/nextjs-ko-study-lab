'use client'

import Link from 'next/link'
import { DEMO_PATH, DISABLED_ID, FULL_ID, SHARED_IDS } from '../lib/constants'

const card = 'rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-800 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
const code = 'block font-mono text-[10px] text-zinc-500'

/** 모두 실제 <Link>다. 도착지 세그먼트에 prefetch = 'partial'이 있는 그룹과 없는 그룹을 나란히 둔다. */
export function LinkGrid() {
  return (
    <div className="space-y-3">
      <Group title="A. prefetch = 'partial' 라우트, 링크 3개 (기본 prefetch)">
        {SHARED_IDS.map((id) => (
          <Link key={id} href={`${DEMO_PATH}/partial/${id}`} className={card}>
            상품 {id}
            <span className={code}>partial/{id}</span>
          </Link>
        ))}
      </Group>
      <Group title="B. prefetch export 없는 라우트, 링크 3개 (기본 prefetch)">
        {SHARED_IDS.map((id) => (
          <Link key={id} href={`${DEMO_PATH}/legacy/${id}`} className={card}>
            상품 {id}
            <span className={code}>legacy/{id}</span>
          </Link>
        ))}
      </Group>
      <Group title="C·D. 같은 partial 라우트, 링크 prop만 다름">
        <Link href={`${DEMO_PATH}/partial/${FULL_ID}`} prefetch className={card}>
          상품 {FULL_ID} · prefetch
          <span className={code}>&lt;Link prefetch&gt;</span>
        </Link>
        <Link href={`${DEMO_PATH}/partial/${DISABLED_ID}`} prefetch={false} className={card}>
          상품 {DISABLED_ID} · prefetch=&#123;false&#125;
          <span className={code}>링크에서 끔</span>
        </Link>
      </Group>
    </div>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">{title}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">{children}</div>
    </div>
  )
}
