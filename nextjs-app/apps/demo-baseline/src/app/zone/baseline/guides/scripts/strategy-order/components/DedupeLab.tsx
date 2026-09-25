'use client'

import React, { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { requestCount, runsOf, updateProbeStore } from '../hooks/useProbeStore'
import { buildProbeBody } from '../probe-body'
import { probeSrc } from '../types'
import type { ProbeName, ProbeStore } from '../types'

const INLINE_WITH_ID = buildProbeBody('inline-with-id')
const INLINE_NO_ID = buildProbeBody('inline-no-id')

/**
 * 같은 스크립트를 여러 컴포넌트가 각자 선언하는 상황(예: 위젯 여러 개가 같은 SDK를 필요로 함).
 * 슬롯 하나가 3개의 <Script>를 선언한다: 같은 id+src, 인라인+id, 인라인(id 없음).
 */
function WidgetSlot({ index }: { index: number }) {
  const recorded = useRef(false)
  useEffect(() => {
    // 개발 모드 StrictMode의 effect 이중 실행에도 인스턴스당 1회만 센다(next/script 내부와 같은 ref 가드).
    if (recorded.current) return
    recorded.current = true
    updateProbeStore((s) => ({ slotMounts: s.slotMounts + 1 }))
  }, [])

  return (
    <li className="rounded border border-zinc-200 px-2 py-1 font-mono text-[11px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
      위젯 슬롯 #{index + 1}
      <Script id="strategy-order-shared-widget" src={probeSrc('shared-widget')} />
      <Script id="strategy-order-inline-with-id">{INLINE_WITH_ID}</Script>
      {/* 안티패턴 대조군: 공식 문서는 인라인 스크립트에 id를 필수로 요구한다. */}
      <Script>{INLINE_NO_ID}</Script>
    </li>
  )
}

const ROWS: { name: ProbeName; label: string; hasSrc: boolean }[] = [
  { name: 'shared-widget', label: 'src + 같은 id', hasSrc: true },
  { name: 'inline-with-id', label: '인라인 + 같은 id', hasSrc: false },
  { name: 'inline-no-id', label: '인라인, id 없음', hasSrc: false },
]

export function DedupeLab({ store }: { store: ProbeStore | null }) {
  const [slots, setSlots] = useState(2)

  return (
    <section className="space-y-2">
      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">3. 같은 스크립트를 여러 곳에서 선언할 때 중복 로드 방지 (id)</h4>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSlots((n) => n + 1)}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          위젯 슬롯 추가 (마운트)
        </button>
        <button
          type="button"
          onClick={() => setSlots((n) => Math.max(0, n - 1))}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          마지막 슬롯 제거 (언마운트)
        </button>
      </div>
      <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {Array.from({ length: slots }, (_, i) => (
          <WidgetSlot key={i} index={i} />
        ))}
      </ul>
      <table className="w-full text-left font-mono text-[11px]">
        <thead className="text-zinc-500">
          <tr>
            <th className="py-1 pr-2 font-medium">선언 방식</th>
            <th className="py-1 pr-2 font-medium">누적 슬롯 마운트</th>
            <th className="py-1 pr-2 font-medium">실제 실행 횟수</th>
            <th className="py-1 font-medium">네트워크 요청</th>
          </tr>
        </thead>
        <tbody className="text-zinc-800 dark:text-zinc-200">
          {ROWS.map((row) => (
            <tr key={row.name} className="border-t border-zinc-200 dark:border-zinc-800">
              <td className="py-1 pr-2">{row.label}</td>
              <td className="py-1 pr-2">{store ? `${store.slotMounts}회` : '-'}</td>
              <td className="py-1 pr-2">{store ? `${runsOf(store, row.name).length}회` : '-'}</td>
              <td className="py-1">{row.hasSrc ? (store ? `${requestCount(row.name)}건` : '-') : '인라인(요청 없음)'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
