'use client'
import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import { BASE, type SlotName } from '../lib/constants'

interface Tab { segment: string; label: string }

/** 슬롯 layout이 그리는 셸. 슬롯 안에서 탭만 바뀌면 이 컴포넌트는 리마운트되지 않는다. */
export function SlotShell({ slot, title, tabs, children }: { slot: SlotName; title: string; tabs: readonly Tab[]; children: ReactNode }) {
  const pathname = usePathname()
  const segment = useSelectedLayoutSegment()
  const [mountId, setMountId] = useState('')
  const [memo, setMemo] = useState('')
  useEffect(function assignMountId() {
    setMountId(Math.random().toString(36).slice(2, 7))
  }, [])
  const active = segment ?? (pathname === BASE ? tabs[slot === 'dashboard' ? 0 : 1].segment : null)
  const color = slot === 'dashboard' ? 'border-blue-300 dark:border-blue-800' : 'border-emerald-300 dark:border-emerald-800'
  return (
    <div data-slot-root={slot} data-mount-id={mountId} className={`space-y-3 rounded-lg border p-4 ${color}`}>
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="font-bold">{title}</span>
        <span className="text-zinc-500">인스턴스 {mountId || '…'} · 세그먼트 {segment ?? '(없음)'}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tabs.map(tab => (
          <Link key={tab.segment} href={`${BASE}/${tab.segment}`} aria-current={active === tab.segment ? 'page' : undefined}
            className={`rounded px-2.5 py-1 text-xs font-bold ${active === tab.segment ? 'bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'border'}`}>
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="rounded border p-3 font-mono text-xs">{children}</div>
      <label className="block text-xs">{title} 메모 (클라이언트 state)
        <input data-slot-memo={slot} value={memo} onChange={e => setMemo(e.target.value)} placeholder="입력 후 다른 슬롯 탭을 눌러 보세요"
          className="mt-1 block w-full rounded border bg-transparent p-1.5" />
      </label>
    </div>
  )
}
