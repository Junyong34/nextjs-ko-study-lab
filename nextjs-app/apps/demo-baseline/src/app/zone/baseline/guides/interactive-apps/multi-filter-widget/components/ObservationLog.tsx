import React from 'react'
import { showSearch } from '../lib/filters'
import type { NavEntry } from '../types'

const KIND_LABEL: Record<NavEntry['kind'], string> = {
  'load:navigate': '문서 로드',
  'load:reload': '새로고침 로드',
  'load:back_forward': '문서 복원(bfcache 외)',
  'load:prerender': '프리렌더 로드',
  push: '필터 push',
  popstate: '뒤로/앞으로',
}

/** 서버 렌더 결과가 화면에 도착할 때마다 남긴 실측 기록. 최신 8건. */
export function ObservationLog({ entries }: { entries: NavEntry[] }) {
  const rows = entries.slice(-8).reverse()
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100">
        관측 로그 — 서버 렌더 도착 시점의 실제 값
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
          <thead className="text-zinc-500">
            <tr>
              <th className="px-3 py-1.5 font-normal">#</th>
              <th className="px-2 py-1.5 font-normal">계기</th>
              <th className="px-2 py-1.5 font-normal">브라우저 URL</th>
              <th className="px-2 py-1.5 font-normal">서버가 받은 값</th>
              <th className="px-2 py-1.5 font-normal">결과</th>
              <th className="px-2 py-1.5 font-normal">renderId</th>
              <th className="px-2 py-1.5 font-normal">소요</th>
              <th className="px-2 py-1.5 font-normal">장바구니</th>
              <th className="px-2 py-1.5 font-normal">인스턴스</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-3 text-zinc-400">
                  hydration 후 첫 기록이 남습니다.
                </td>
              </tr>
            ) : (
              rows.map((e) => (
                <tr key={e.seq} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-3 py-1.5">{e.seq}</td>
                  <td className="px-2 py-1.5">{KIND_LABEL[e.kind]}</td>
                  <td className="px-2 py-1.5 break-all">{showSearch(e.urlSearch)}</td>
                  <td className={`px-2 py-1.5 break-all ${e.urlSearch === e.serverSearch ? '' : 'text-rose-600'}`}>
                    {showSearch(e.serverSearch)}
                  </td>
                  <td className="px-2 py-1.5">{e.count}개</td>
                  <td className="px-2 py-1.5">
                    {e.renderId}
                    {e.reusedRender && <span className="ml-1 text-amber-600 dark:text-amber-400">(재사용)</span>}
                  </td>
                  <td className="px-2 py-1.5">{e.ms === null ? '-' : `${e.ms}ms`}</td>
                  <td className="px-2 py-1.5">{e.cartBefore === null ? `${e.cartAfter}` : `${e.cartBefore}→${e.cartAfter}`}</td>
                  <td className="px-2 py-1.5">{e.mountId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
