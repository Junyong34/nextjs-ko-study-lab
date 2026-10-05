import { Suspense } from 'react'
import { connection } from 'next/server'
import { getLongCached, getShortStale } from '../lib/catalog'
import { DETAIL_DELAY_MS, REALTIME_DELAY_MS } from '../lib/constants'
import type { Area } from '../types'
import { Mark } from './Mark'

const box = 'rounded border border-zinc-200 bg-white p-2.5 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-950'

function Row({ area, title, children }: { area: Area; title: string; children: React.ReactNode }) {
  return (
    <div className={box} data-demo-area={area}>
      <span className="mr-2 rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">{area}</span>
      <span className="font-bold text-zinc-900 dark:text-zinc-100">{title}</span>
      <div className="mt-1 text-zinc-600 dark:text-zinc-400">{children}</div>
      <Mark area={area} />
    </div>
  )
}

const pending = (label: string) => <p className="font-mono text-[11px] text-zinc-400">{label} 대기 중…</p>

async function LongCached() {
  const c = await getLongCached()
  return <Row area="B" title="캐시(긴 stale, hours)">'use cache' 결과 #{c.id} (생성 {c.at})</Row>
}

async function ShortStale() {
  const c = await getShortStale()
  return <Row area="B2" title="캐시(짧은 stale, 60초)">'use cache' 결과 #{c.id} (생성 {c.at})</Row>
}

async function UrlData({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await new Promise((r) => setTimeout(r, DETAIL_DELAY_MS))
  return <Row area="C" title="URL별 (params)">id = {id} · {DETAIL_DELAY_MS}ms 지연 뒤 해결</Row>
}

async function Realtime() {
  await connection()
  await new Promise((r) => setTimeout(r, REALTIME_DELAY_MS))
  return <Row area="D" title="실시간 (connection)">요청마다 계산 · {REALTIME_DELAY_MS}ms 지연 뒤 해결 · {new Date().toLocaleTimeString('ko-KR', { hour12: false })}</Row>
}

/** 도착 페이지의 다섯 영역. 어느 영역이 prefetch에 실려 오는지는 클릭 뒤 도착 시각으로 확인한다. */
export function Areas({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="space-y-2">
      <Row area="A" title="고정 문구">데이터 없이 바로 그려지는 영역</Row>
      <LongCached />
      <Suspense fallback={pending('B2')}>
        <ShortStale />
      </Suspense>
      <Suspense fallback={pending('C')}>
        <UrlData params={params} />
      </Suspense>
      <Suspense fallback={pending('D')}>
        <Realtime />
      </Suspense>
    </div>
  )
}
