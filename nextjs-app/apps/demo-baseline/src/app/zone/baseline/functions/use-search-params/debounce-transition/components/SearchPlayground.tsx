'use client'
import React from 'react'
import { DemoResetButton, MOCK_PRODUCTS, ProductCard } from '@study/demo-kit'
import { matchesQuery } from '../search'
import type { KeystrokeEntry, TransitionEdge } from '../types'

export interface SearchPlaygroundProps {
  inputValue: string
  onChange: (value: string) => void
  isPending: boolean
  keystrokes: KeystrokeEntry[]
  transitionEdges: TransitionEdge[]
  inputRenderLatencyMs: number | null
  queryFromUrl: string
  rawQueryString: string
  onReset: () => void
}

export function SearchPlayground({
  inputValue,
  onChange,
  isPending,
  keystrokes,
  transitionEdges,
  inputRenderLatencyMs,
  queryFromUrl,
  rawQueryString,
  onReset,
}: SearchPlaygroundProps) {
  const results = MOCK_PRODUCTS.filter((product) => matchesQuery(product, queryFromUrl))
  const lastEdge = transitionEdges[transitionEdges.length - 1]

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <label htmlFor="debounce-search-input" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            상품 실시간 검색
          </label>
          <p className="text-zinc-500 text-[11px]">타이핑은 즉시 반영되고, 입력을 멈춘 뒤 {inputValue ? '300ms' : ''} 뒤에만 주소창 쿼리가 실제로 바뀝니다.</p>
        </div>
        <div className="flex items-center gap-1.5">
          {isPending ? (
            <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-700 animate-pulse dark:bg-blue-950 dark:text-blue-300">
              isPending: true (URL 전환 중)
            </span>
          ) : (
            <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              isPending: false
            </span>
          )}
        </div>
      </div>

      <input
        id="debounce-search-input"
        type="text"
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder="상품명을 입력하세요 (예: 키보드, 헤드폰, 데님)"
        className="w-full rounded border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="rounded bg-zinc-50 p-2.5 dark:bg-zinc-900 font-mono">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">로컬 입력값 (즉시)</div>
          <div className="text-zinc-800 dark:text-zinc-200">&quot;{inputValue || '(비어 있음)'}&quot;</div>
          <div className="text-[11px] text-zinc-500 mt-1">
            렌더 반영 지연: {inputRenderLatencyMs !== null ? `${inputRenderLatencyMs.toFixed(1)}ms` : '측정 전'}
          </div>
        </div>
        <div className="rounded bg-blue-50 p-2.5 dark:bg-blue-950/40 font-mono">
          <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wider mb-1">URL 쿼리 (디바운스 후)</div>
          <div className="text-blue-800 dark:text-blue-200">{rawQueryString ? `?${rawQueryString}` : '(쿼리 없음)'}</div>
          <div className="text-[11px] text-blue-500 dark:text-blue-400 mt-1">
            {lastEdge ? `마지막 전환 ${lastEdge.type === 'start' ? '시작' : '종료'} → 키 입력 후 ${lastEdge.sinceLastKeystrokeMs.toFixed(1)}ms` : '전환 이력 없음'}
          </div>
        </div>
      </div>

      <div className="rounded border border-dashed border-zinc-300 bg-white p-2.5 dark:border-zinc-700 dark:bg-zinc-950">
        <p className="text-zinc-500 text-[11px] mb-1.5">최근 키 입력 실측 타임스탬프 (performance.now() 기준, 최신순):</p>
        {keystrokes.length === 0 ? (
          <p className="text-zinc-400">아직 입력 없음</p>
        ) : (
          <ol className="space-y-0.5 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
            {[...keystrokes].reverse().map((entry, index) => (
              <li key={`${entry.atMs}-${index}`}>
                t={entry.atMs.toFixed(1)}ms → &quot;{entry.value || '(비움)'}&quot;
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-bold text-zinc-700 dark:text-zinc-300">검색 결과 ({results.length}개 상품, URL 쿼리 기준)</div>
          <DemoResetButton label="검색 초기화" onReset={onReset} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {results.length === 0 && <p className="text-center text-zinc-400 py-4">조건에 맞는 상품이 없습니다.</p>}
      </div>
    </div>
  )
}
