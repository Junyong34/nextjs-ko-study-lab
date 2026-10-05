'use client'

import Link from 'next/link'
import { COLD_IDS, DEMO_PATH, DISABLED_ID, FULL_ID, SHARED_IDS } from '../lib/constants'
import type { LinkKind, RouteKind } from '../types'
import { useProbe } from './ProbeContext'

const card = 'rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-800 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
const code = 'block font-mono text-[10px] text-zinc-500'

/** 모두 실제 <Link>다. 클릭하면 그 시각을 기록해, 도착지 영역이 나타난 시각을 클릭 기준으로 잰다. */
export function LinkGrid() {
  const { recordClick } = useProbe()
  const props = (route: RouteKind, link: LinkKind, id: string) => ({ onClick: () => recordClick(route, link, id), className: card })

  return (
    <div className="space-y-3">
      <Group title="A. prefetch = 'partial' 라우트, 링크 3개 (기본 prefetch)">
        {SHARED_IDS.map((id) => (
          <Link key={id} href={`${DEMO_PATH}/partial/${id}`} {...props('partial', 'default', id)}>
            상품 {id}
            <span className={code}>partial/{id}</span>
          </Link>
        ))}
      </Group>
      <Group title="B. prefetch export 없는 라우트, 링크 3개 (기본 prefetch)">
        {SHARED_IDS.map((id) => (
          <Link key={id} href={`${DEMO_PATH}/legacy/${id}`} {...props('legacy', 'default', id)}>
            상품 {id}
            <span className={code}>legacy/{id}</span>
          </Link>
        ))}
      </Group>
      <Group title="C·D. 같은 partial 라우트, 링크 prop만 다름">
        <Link href={`${DEMO_PATH}/partial/${FULL_ID}`} prefetch {...props('partial', 'prefetch', FULL_ID)}>
          상품 {FULL_ID} · prefetch
          <span className={code}>&lt;Link prefetch&gt;</span>
        </Link>
        <Link href={`${DEMO_PATH}/partial/${DISABLED_ID}`} prefetch={false} {...props('partial', 'false', DISABLED_ID)}>
          상품 {DISABLED_ID} · prefetch=&#123;false&#125;
          <span className={code}>링크에서 끔</span>
        </Link>
      </Group>
      <Group title="E. 링크가 전부 prefetch={false}인 라우트 (셸을 공유할 다른 링크 없음)">
        {COLD_IDS.map((id) => (
          <Link key={id} href={`${DEMO_PATH}/cold/${id}`} prefetch={false} {...props('cold', 'false', id)}>
            상품 {id} · cold
            <span className={code}>cold/{id}</span>
          </Link>
        ))}
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
