'use client'
import React, { useEffect, useState } from 'react'
import { DemoPlaygroundCard, ExpectedActualPanel, MOCK_PRODUCTS, type Product } from '@study/demo-kit'
import type { ServerWindowProbeResult } from '../types'

const STORAGE_KEY = 'demo_recent_products'
const PENDING_LABEL = '(마운트 전 · 서버와 동일하게 알 수 없음)'

interface StoredState {
  items: Product[]
  savedAt: string
}

export function WindowStorageAccessDemo({ serverProbe }: { serverProbe: ServerWindowProbeResult }) {
  const [recentViewed, setRecentViewed] = useState<Product[]>([])
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [clientTypeofWindow, setClientTypeofWindow] = useState(PENDING_LABEL)
  const [mountedAt, setMountedAt] = useState<string | null>(null)

  useEffect(() => {
    // 'use client' 컴포넌트가 브라우저에서 마운트된 뒤 실제로 typeof window를 측정한다.
    setClientTypeofWindow(typeof window)
    setMountedAt(new Date().toISOString())
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: StoredState = JSON.parse(raw)
        setRecentViewed(parsed.items)
        setSavedAt(parsed.savedAt)
      }
    } catch {
      // ignore
    }
  }, [])

  const persist = (items: Product[]) => {
    const savedAtNow = new Date().toISOString()
    setRecentViewed(items)
    setSavedAt(savedAtNow)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, savedAt: savedAtNow }))
    } catch {
      // ignore
    }
  }

  const addRecent = (product: Product) => {
    persist([product, ...recentViewed.filter((p) => p.id !== product.id)].slice(0, 4))
  }

  const clearStorage = () => {
    setRecentViewed([])
    setSavedAt(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  const clientAccessSucceeded = clientTypeofWindow === 'object'
  const serverAccessFailed = serverProbe.errorName !== '(에러 없음)'
  const isMatched = mountedAt === null ? undefined : serverAccessFailed && clientAccessSucceeded

  return (
    <>
      <DemoPlaygroundCard title="page.tsx(서버) vs WindowStorageAccessDemo.tsx('use client')">
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-rose-200 bg-rose-50/50 p-3 dark:border-rose-900/60 dark:bg-rose-950/20">
              <div className="mb-1 font-bold text-rose-800 dark:text-rose-300">서버 컴포넌트 실측 (page.tsx)</div>
              <dl className="space-y-0.5 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                <div>typeof window: <b>{serverProbe.typeofWindow}</b></div>
                <div className="break-words">{serverProbe.errorName}: {serverProbe.errorMessage}</div>
                <div className="text-zinc-400">측정 시각 {serverProbe.checkedAt}</div>
              </dl>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="mb-1 font-bold text-emerald-800 dark:text-emerald-300">'use client' 컴포넌트 실측 (여기)</div>
              <dl className="space-y-0.5 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                <div>typeof window: <b>{clientTypeofWindow}</b></div>
                <div className="text-zinc-400">{mountedAt ? `마운트 시각 ${mountedAt}` : '마운트 대기 중'}</div>
              </dl>
            </div>
          </div>

          <div className="space-y-2 rounded-md border border-zinc-200/80 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">최근 본 상품 (localStorage 실제 저장)</span>
              <button
                type="button"
                onClick={clearStorage}
                className="cursor-pointer rounded border border-zinc-200 px-2 py-1 text-[11px] text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                기록 비우기
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {MOCK_PRODUCTS.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addRecent(p)}
                  className="cursor-pointer rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-zinc-800 transition hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  {p.name}
                </button>
              ))}
            </div>
            {recentViewed.length === 0 ? (
              <div className="text-zinc-400">최근 본 상품이 없습니다. 위 상품을 클릭해보세요.</div>
            ) : (
              <div className="space-y-1">
                {recentViewed.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                    <span>{idx + 1}. {item.name} ({item.categoryName})</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.price.toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            )}
            <div className="text-[11px] text-zinc-400">
              {savedAt ? `마지막 저장 ${savedAt} — 새로고침해도 이 값이 유지됩니다.` : '아직 저장된 값이 없습니다.'}
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      <ExpectedActualPanel
        title="서버 vs 클라이언트 window 접근 경계 검증"
        expected="서버 컴포넌트는 window 접근 시 실패(에러 발생)하고, 'use client' 컴포넌트는 마운트 후 정상 접근(typeof window === 'object')한다"
        actual={`서버: ${serverProbe.errorName} (typeof window === '${serverProbe.typeofWindow}') / 클라이언트: typeof window === '${clientTypeofWindow}'`}
        isMatched={isMatched}
        description={
          isMatched === undefined
            ? '아직 클라이언트 컴포넌트가 마운트되지 않았습니다. 마운트가 끝나면 자동으로 결과가 채워집니다.'
            : isMatched
            ? '서버에서는 실제로 접근이 실패했고, 클라이언트는 마운트 후 실제로 접근에 성공했습니다.'
            : '기대한 경계 동작과 다른 결과가 감지되었습니다.'
        }
      />
    </>
  )
}
