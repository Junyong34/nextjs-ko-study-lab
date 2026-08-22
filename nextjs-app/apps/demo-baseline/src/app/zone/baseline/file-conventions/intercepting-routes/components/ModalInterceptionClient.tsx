'use client'
import React from 'react'
import Link from 'next/link'

const PHOTOS = [
  {
    id: '101',
    title: '에어 줌 페가수스 러닝화',
    category: '러닝화 카테고리',
    price: 139000,
    color: 'from-blue-600 to-indigo-700',
  },
  {
    id: '102',
    title: '윈드러너 후디 자켓',
    category: '스포츠 아우터',
    price: 179000,
    color: 'from-emerald-600 to-teal-700',
  },
  {
    id: '103',
    title: '테크 에어로스위프트 타이츠',
    category: '트레이닝 웨어',
    price: 99000,
    color: 'from-purple-600 to-pink-700',
  },
]

export function ModalInterceptionClient() {
  const BASE_PATH = '/zone/baseline/file-conventions/intercepting-routes'

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">이커머스 상품 갤러리 피드</h4>
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              (.)photos/[id] 인터셉트 지원
            </span>
          </div>
          <p className="text-xs text-zinc-500">상품 카드를 클릭하면 Next.js Soft Navigation에 의해 모달이 인터셉트되어 띄워집니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PHOTOS.map((p) => (
          <div
            key={p.id}
            className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-all hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <div className="space-y-2">
              <div className={`h-24 w-full rounded-md bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-bold text-xs p-2 text-center`}>
                {p.title}
              </div>
              <div>
                <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">{p.title}</h5>
                <p className="text-[11px] text-zinc-500">{p.category}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-2.5 dark:border-zinc-800">
              <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                {p.price.toLocaleString()}원
              </span>
              <Link
                href={`${BASE_PATH}/photos/${p.id}`}
                className="rounded bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                모달 열기 →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
