'use client'

import React, { useState } from 'react'

const PRODUCTS = [
  { id: '101', name: '초경량 카본 러닝화', price: 179000, desc: '카본 플레이트 탑재 마라톤 레이싱 슈즈' },
  { id: '102', name: '가스켓 마운트 기계식 키보드', price: 189000, desc: 'CNC 알루미늄 하우징 및 RGB 핫스왑' },
  { id: '103', name: '노이즈 캔슬링 무선 헤드폰', price: 299000, desc: '하이브리드 ANC 및 고해상도 LDAC 코덱' },
]

export function ModalInterceptionClient() {
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null)

  return (
    <div className="space-y-4">
      {/* 1. 상품 목록 그리드 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="flex flex-col justify-between rounded border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div>
              <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                {prod.name}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                {prod.desc}
              </p>
              <div className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-2">
                {prod.price.toLocaleString()}원
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedProduct(prod)}
              className="mt-3 inline-flex w-full items-center justify-center rounded bg-zinc-900 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              모달로 보기 ((..)products/[id])
            </button>
          </div>
        ))}
      </div>

      {/* 2. 인터셉팅 모달 오버레이 */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  (..)products/[id] 인터셉트 모달
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="h-6 w-6 rounded-full bg-zinc-100 text-xs font-bold text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
              >
                
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {selectedProduct.name}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {selectedProduct.desc}
              </p>
              <div className="font-mono text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {selectedProduct.price.toLocaleString()}원
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 cursor-pointer"
              >
                모달 닫기
              </button>
              <button
                type="button"
                onClick={() => alert('장바구니에 담겼습니다!')}
                className="rounded bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
              >
                바로 구매하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
