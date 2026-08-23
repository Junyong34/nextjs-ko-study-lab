'use client'
import React, { useState } from 'react'

export function ScriptLoadingStrategiesDemo() {
  const [selectedStrategy, setSelectedStrategy] = useState<'beforeInteractive' | 'afterInteractive' | 'lazyOnload'>('afterInteractive')
  const [loadedScripts, setLoadedScripts] = useState<string[]>([])

  const strategies = [
    {
      key: 'beforeInteractive',
      name: 'beforeInteractive',
      target: '결제 보안 봇 감지 모듈 (Bot Detection)',
      desc: 'HTML 셸 수신 직후 페이지 인터랙션 전 최우선 로드'
    },
    {
      key: 'afterInteractive',
      name: 'afterInteractive (기본값)',
      target: '토스페이먼츠 / 카카오페이 결제창 SDK',
      desc: '페이지 하이드레이션 완료 후 즉시 로드'
    },
    {
      key: 'lazyOnload',
      name: 'lazyOnload',
      target: 'Google Analytics 전자상거래 구매 추적 픽셀',
      desc: '브라우저 유휴 시간(Idle)에 지연 로드하여 LCP/INP 보호'
    }
  ]

  const handleSimulateLoad = (key: any) => {
    setSelectedStrategy(key)
    if (!loadedScripts.includes(key)) {
      setLoadedScripts(prev => [...prev, key])
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">next/script 로딩 전략별 결제 SDK 및 추적 스크립트 실행 순서</h4>
        <p className="text-zinc-500 text-[11px]">이커머스 결제창, 봇 감지, 애널리틱스 스크립트의 실행 우선순위를 최적화합니다.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {strategies.map(s => (
          <button
            key={s.key}
            type="button"
            onClick={() => handleSimulateLoad(s.key)}
            className={`p-3 rounded border text-left cursor-pointer transition ${
              selectedStrategy === s.key
                ? 'border-blue-600 bg-blue-50/50 font-bold dark:border-blue-500 dark:bg-blue-950/20'
                : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
            }`}
          >
            <div className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">{s.name}</div>
            <div className="text-zinc-900 dark:text-zinc-100 font-bold mt-1">{s.target}</div>
            <div className="text-zinc-500 text-[10px] mt-1">{s.desc}</div>
          </button>
        ))}
      </div>

      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 font-mono space-y-1.5">
        <div className="font-bold text-zinc-700 dark:text-zinc-300">
          활성 전략: {'<'}Script strategy="{selectedStrategy}" /{'>'}
        </div>
        <div className="text-emerald-600 dark:text-emerald-400">
          - {strategies.find(s => s.key === selectedStrategy)?.target} 로딩 준비 완료 (onLoad 이벤트 대기)
        </div>
      </div>
    </div>
  )
}
