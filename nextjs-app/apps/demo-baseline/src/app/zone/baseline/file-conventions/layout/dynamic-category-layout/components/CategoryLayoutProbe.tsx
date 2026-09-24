'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { categoryFromPathname, categoryLabel } from '../catalog'
import { useObservation } from './ObservationContext'
import { PropsBlock } from './PropsBlock'

interface CategoryLayoutProbeProps {
  category: string
  renderId: string
  renderedAt: string
  paramsJson: string
  propKeys: string[]
}

function createMountId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `mount-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/**
 * [category]/layout.tsx가 렌더하는 클라이언트 컴포넌트.
 * 서버에서 받은 값(render ID·params)은 props로 고정되고, 메모·카운터·mount ID는
 * 이 인스턴스의 useState에 산다. layout이 리마운트되면 전부 새로 시작한다.
 */
export function CategoryLayoutProbe({ category, renderId, renderedAt, paramsJson, propKeys }: CategoryLayoutProbeProps) {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const location = search ? `${pathname}?${search}` : pathname
  const { reportLayout } = useObservation()

  const [mountId, setMountId] = useState('')
  const mountedId = useRef<string | null>(null)
  useEffect(() => {
    // SSR와 첫 클라이언트 렌더를 같게 두고, 마운트 후에 인스턴스 ID를 만든다.
    mountedId.current ??= createMountId()
    setMountId(mountedId.current)
  }, [])
  const [counter, setCounter] = useState(0)
  const [memo, setMemo] = useState('')

  useEffect(() => {
    if (!mountId) return
    // 교체 직전의 이전 layout 인스턴스가 새 경로를 보고하지 않도록 경로의 category와 대조한다.
    if (categoryFromPathname(pathname) !== category) return
    reportLayout({ location, pathname, category, renderId, renderedAt, paramsJson, propKeys, mountId, counter, memo })
  }, [location, pathname, category, renderId, renderedAt, paramsJson, propKeys, mountId, counter, memo, reportLayout])

  return (
    <div className="min-w-0 space-y-3">
      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
        {categoryLabel(category)} 카테고리 공통 레이아웃 <code className="font-mono font-normal">[category]/layout.tsx</code>
      </p>
      <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
        <PropsBlock
          title="layout이 서버에서 받은 값"
          rows={[
            ['props 키', `[${propKeys.join(', ')}]`],
            ['await params', paramsJson],
            ['render ID', renderId.slice(0, 8)],
            ['렌더 시각', renderedAt.slice(11, 23)],
          ]}
        />
        <div className="min-w-0 space-y-2 rounded border border-zinc-200 p-2.5 text-[11px] dark:border-zinc-800">
          <p className="font-bold text-zinc-900 dark:text-zinc-100">
            layout 안 클라이언트 상태 (mount ID{' '}
            <code className="font-mono font-normal">{mountId ? mountId.slice(0, 8) : '관측 준비 중'}</code>)
          </p>
          <label htmlFor="dynamic-category-memo" className="block text-zinc-600 dark:text-zinc-400">
            카테고리 메모
          </label>
          <input
            id="dynamic-category-memo"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예: 가격 비교 중"
            className="w-full min-w-0 rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCounter((c) => c + 1)}
              className="cursor-pointer rounded bg-zinc-900 px-2.5 py-1 font-bold text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              관심 표시 +1
            </button>
            <span className="font-mono" data-testid="layout-counter">
              {counter}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
