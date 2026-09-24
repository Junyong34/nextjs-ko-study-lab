import React from 'react'
import { showSearch } from '../lib/filters'
import type { ServerSnapshot } from '../types'

interface StatePanelProps {
  href: string
  snapshot: ServerSnapshot
  cartCount: number
  mountId: string | null
}

function Column({ title, owner, children }: { title: string; owner: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{title}</div>
      <div className="mb-2 font-mono text-[10px] text-zinc-500">{owner}</div>
      <dl className="space-y-1 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">{children}</dl>
    </div>
  )
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-zinc-500">{k}</dt>
      <dd className="min-w-0 break-all">{v}</dd>
    </div>
  )
}

/** 세 위치에 있는 상태의 현재 실측값. */
export function StatePanel({ href, snapshot, cartCount, mountId }: StatePanelProps) {
  const f = snapshot.filters
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Column title="URL — 필터·정렬" owner="useSearchParams() / router.push">
        <Row k="query" v={showSearch(href.split('?')[1] ?? '')} />
        <Row k="공유" v="링크·북마크로 그대로 전달" />
        <Row k="history" v="이동마다 항목 추가" />
      </Column>
      <Column title="서버 — 필터링된 목록" owner="page.tsx (Server Component)">
        <Row k="받은 searchParams" v={showSearch(snapshot.receivedSearch)} />
        <Row
          k="해석"
          v={`category=[${f.categories.join(',')}] sort=${f.sort ?? '-'} stock=${f.inStock ? 'in' : '-'}`}
        />
        <Row k="결과" v={`${snapshot.count} / ${snapshot.total}개`} />
        <Row k="renderId" v={snapshot.renderId} />
        <Row k="렌더 시각" v={snapshot.renderedAt} />
        <Row k="주입 지연" v={`${snapshot.latencyMs}ms`} />
      </Column>
      <Column title="클라이언트 — 장바구니" owner="ShopDemo useState (Client Component)">
        <Row k="장바구니" v={`${cartCount}개`} />
        <Row k="인스턴스 ID" v={mountId ?? '(hydration 전)'} />
        <Row k="URL·서버" v="이 값을 모름" />
      </Column>
    </div>
  )
}
