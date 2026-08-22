'use client'
import React from 'react'
import Link from 'next/link'

export function NotFoundDemo() {
  const BASE_PATH = '/zone/baseline/file-conventions/not-found/missing-product-404'

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">쇼핑몰 not-found.tsx 및 notFound() 실습</h4>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              items/[id]/not-found.tsx 구축 완료
            </span>
          </div>
          <p className="text-xs text-zinc-500">데이터베이스에 없는 상품 접근 시 <code>notFound()</code> 함수로 404 전용 화면을 띄웁니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">1. 정상 등록 상품</span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">200 OK</span>
            </div>
            <p className="text-xs text-zinc-500">DB에 존재하는 PROD-101 상품 페이지로 이동합니다.</p>
          </div>
          <div className="pt-2">
            <Link
              href={`${BASE_PATH}/items/PROD-101`}
              className="block text-center rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
            >
              /items/PROD-101 진입 →
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-amber-300 bg-amber-50/40 p-4 dark:border-amber-900/50 dark:bg-amber-950/20 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-amber-950 dark:text-amber-200">2. 미등록/단종 상품 (404 트리거)</span>
              <span className="rounded bg-amber-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200">notFound()</span>
            </div>
            <p className="text-xs text-zinc-500">DB에 없는 PROD-999 접근 시 notFound()가 호출되어 not-found.tsx가 렌더링됩니다.</p>
          </div>
          <div className="pt-2">
            <Link
              href={`${BASE_PATH}/items/PROD-999-NOT-FOUND`}
              className="block text-center rounded bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
            >
              /items/PROD-999 진입 (404 확인) →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
