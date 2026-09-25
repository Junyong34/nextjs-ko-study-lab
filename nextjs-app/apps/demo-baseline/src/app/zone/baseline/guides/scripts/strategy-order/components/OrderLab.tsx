'use client'

import React, { useState } from 'react'
import Script from 'next/script'
import { DemoResetButton } from '@study/demo-kit'
import { CORE_DELAY_MS, probeSrc } from '../types'
import type { ProbeStore } from '../types'
import { ExecutionTimeline } from './ExecutionTimeline'

/**
 * 한 페이지에 서드파티 스크립트 여러 개를 두는 가이드 시나리오.
 * - core-sdk(무거운 SDK, 서버가 실제로 800ms 늦게 응답)를 먼저, core-plugin(코어에 의존)을 나중에 선언한다.
 *   afterInteractive 스크립트는 동적으로 삽입된 async <script>라서 "선언 순서"가 아니라 "도착 순서"로 실행된다.
 * - 의존 관계가 있으면 플러그인을 코어의 onReady 이후에 렌더해 순서를 코드로 보장한다(core-plugin-chained).
 * - chat-widget은 lazyOnload로 load 이벤트 이후 유휴 시간까지 미룬다.
 */
export function OrderLab({ store }: { store: ProbeStore | null }) {
  const [coreReady, setCoreReady] = useState(false)

  return (
    <section className="space-y-3">
      <Script id="strategy-order-core-sdk" src={probeSrc('core-sdk', CORE_DELAY_MS)} onReady={() => setCoreReady(true)} />
      <Script id="strategy-order-core-plugin" src={probeSrc('core-plugin')} />
      {coreReady && <Script id="strategy-order-core-plugin-chained" src={probeSrc('core-plugin-chained')} />}
      <Script id="strategy-order-chat-widget" src={probeSrc('chat-widget')} strategy="lazyOnload" />

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">1. 여러 스크립트의 실제 실행 순서</h4>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            선언 순서: core-sdk → core-plugin → chat-widget(lazyOnload). 레이아웃에는 layout-analytics가 있습니다.
            코어 onReady 이후에만 렌더되는 core-plugin-chained는 의존 순서를 코드로 보장한 버전입니다.
          </p>
        </div>
        <DemoResetButton label="처음부터 다시 측정 (새로고침)" />
      </div>
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-1.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
          실측 타임라인 (performance.now(), 실제 발생 순 — 이 문서가 로드된 뒤의 모든 기록)
        </div>
        <ExecutionTimeline store={store} />
      </div>
    </section>
  )
}
