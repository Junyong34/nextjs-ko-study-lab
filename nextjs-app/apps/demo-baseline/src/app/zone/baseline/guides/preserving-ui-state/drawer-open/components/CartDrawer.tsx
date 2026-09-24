'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import type { DrawerSlot } from '../types'
import { SLOT_LABELS } from '../verification'
import { usePlacementObserver } from './PlacementObserver'

const OWNER_FILES: Record<DrawerSlot, string> = {
  layout: 'drawer-open/layout.tsx',
  keyed: 'drawer-open/layout.tsx · key={pathname}',
  page: 'drawer-open/[현재 카테고리]/page.tsx',
}

function createMountId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `mount-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/**
 * 장바구니 Drawer. 열림 여부·배송 메모는 이 컴포넌트 자신의 useState이고,
 * 목록 스크롤은 DOM 상태다. 어디에 렌더링되느냐(layout / key / page)만 다르다.
 */
export function CartDrawer({ slot }: { slot: DrawerSlot }) {
  const pathname = usePathname()
  const { report } = usePlacementObserver()
  const [mountId, setMountId] = useState('')
  const mountRef = useRef<string | null>(null)
  const [open, setOpen] = useState(false)
  const [memo, setMemo] = useState('')
  const [scrollTick, setScrollTick] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    // 서버 HTML과 첫 클라이언트 렌더를 맞추기 위해 마운트 후에 ID를 만든다.
    mountRef.current ??= createMountId()
    setMountId(mountRef.current)
  }, [])

  useEffect(() => {
    if (!mountId) return
    // scrollTop은 state 추정이 아니라 실제 DOM 값을 읽는다.
    const scrollTop = Math.round(listRef.current?.scrollTop ?? 0)
    report({ slot, mountId, pathname, open, memo, scrollTop })
  }, [slot, mountId, pathname, open, memo, scrollTick, report])

  const inputId = `drawer-memo-${slot}`

  return (
    <section
      aria-label={SLOT_LABELS[slot]}
      className="min-w-0 rounded-lg border border-zinc-200 bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{SLOT_LABELS[slot]}</p>
          <p className="break-all font-mono text-[10px] text-zinc-500">{OWNER_FILES[slot]}</p>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-label={`${SLOT_LABELS[slot]} ${open ? '닫기' : '열기'}`}
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          장바구니 {open ? '닫기' : '열기'}
        </button>
      </div>
      <p className="mt-1.5 font-mono text-[10px] text-zinc-500">
        mount <span data-testid={`mount-${slot}`}>{mountId ? mountId.slice(0, 6) : '준비 중'}</span>
      </p>

      {open && (
        <div className="mt-2 space-y-2 border-t border-zinc-200 pt-2 dark:border-zinc-800">
          <ul
            ref={listRef}
            data-testid={`list-${slot}`}
            onScroll={() => setScrollTick((tick) => tick + 1)}
            className="max-h-24 space-y-1 overflow-y-auto rounded border border-zinc-200 p-1.5 text-[11px] dark:border-zinc-800"
          >
            {MOCK_PRODUCTS.map((product) => (
              <li key={product.id} className="flex justify-between gap-2 py-0.5">
                <span className="truncate">{product.name}</span>
                <span className="shrink-0 font-mono text-zinc-500">{product.price.toLocaleString('ko-KR')}원</span>
              </li>
            ))}
          </ul>
          <label htmlFor={inputId} className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
            배송 메모 ({SLOT_LABELS[slot]})
          </label>
          <input
            id={inputId}
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="예: 문 앞에 놓아주세요"
            className="w-full min-w-0 rounded-md border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      )}
    </section>
  )
}
