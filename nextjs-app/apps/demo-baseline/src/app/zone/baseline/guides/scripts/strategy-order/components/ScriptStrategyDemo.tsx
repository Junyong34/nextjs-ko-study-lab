'use client'
import React, { useEffect, useState } from 'react'
import Script from 'next/script'

interface ScriptLoad {
  strategy: string
  at: number
}

interface ScriptStrategyDemoProps {
  onLoadsChange: (loads: ScriptLoad[]) => void
}

const BASE = '/zone/baseline/guides/scripts/strategy-order/api/tick'

export function ScriptStrategyDemo({ onLoadsChange }: ScriptStrategyDemoProps) {
  const [loads, setLoads] = useState<ScriptLoad[]>([])

  useEffect(() => {
    // beforeInteractive 스크립트는 이 컴포넌트가 마운트되기 전에 이미 실행될 수 있으므로,
    // 개별 onLoad 콜백 대신 window.__scriptLoads 로그를 폴링해 신뢰성 있게 관찰한다.
    const interval = setInterval(() => {
      const w = window as unknown as { __scriptLoads?: ScriptLoad[] }
      if (w.__scriptLoads) {
        const next = [...w.__scriptLoads]
        setLoads(next)
        onLoadsChange(next)
      }
    }, 300)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs">
      <Script src={`${BASE}?s=beforeInteractive`} strategy="beforeInteractive" />
      <Script src={`${BASE}?s=afterInteractive`} strategy="afterInteractive" />
      <Script src={`${BASE}?s=lazyOnload`} strategy="lazyOnload" />

      <div className="text-blue-600 dark:text-blue-400">• strategy=&quot;beforeInteractive&quot;: 봇 탐지 및 필수 폴리필</div>
      <div className="text-emerald-600 dark:text-emerald-400">• strategy=&quot;afterInteractive&quot;: 구글 애널리틱스 (기본값)</div>
      <div className="text-purple-600 dark:text-purple-400">• strategy=&quot;lazyOnload&quot;: 하단 실시간 상담 챗봇 위젯</div>

      <div className="border-t border-zinc-800 pt-2 mt-2 text-zinc-400">실제 로드 순서(window.__scriptLoads):</div>
      {loads.length === 0 ? (
        <div className="text-zinc-500">로드 대기 중...</div>
      ) : (
        loads
          .sort((a, b) => a.at - b.at)
          .map((l, i) => (
            <div key={l.strategy} className="text-emerald-400">
              {i + 1}. {l.strategy}
            </div>
          ))
      )}
    </div>
  )
}
