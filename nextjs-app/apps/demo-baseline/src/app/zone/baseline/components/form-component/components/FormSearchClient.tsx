'use client'
import React, { useState } from 'react'
import { MOCK_PRODUCTS, ProductCard } from '@study/demo-kit'

export function FormSearchClient() {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedQuery(query)
  }

  const results = MOCK_PRODUCTS.filter(p =>
    !submittedQuery ? true : p.name.toLowerCase().includes(submittedQuery.toLowerCase()) || p.tags.some(t => t.includes(submittedQuery))
  )

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Next.js 빌트인 &lt;Form&gt; 컴포넌트 & GET 검색 동기화</h4>
        <p className="text-zinc-500 text-[11px]">GET 방식 폼 제출 시 URL searchParams와 동기화되며 Prefetch 및 클라이언트 네비게이션이 자동 최적화됩니다.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="상품명, 태그 검색 (예: 키보드, 무선, 데님)"
          className="flex-1 rounded border border-zinc-300 bg-white px-3 py-1.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-1.5 font-bold text-white shadow-2xs hover:bg-blue-700 cursor-pointer"
        >
          검색
        </button>
      </form>

      <div className="space-y-2">
        <div className="flex justify-between text-zinc-500 font-mono">
          <span>검색어: "{submittedQuery || '전체'}"</span>
          <span>검색된 상품: {results.length}건</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {results.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
