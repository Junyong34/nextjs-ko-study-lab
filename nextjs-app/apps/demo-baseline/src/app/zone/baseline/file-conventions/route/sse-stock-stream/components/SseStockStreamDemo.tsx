'use client'
import React, { useEffect, useState } from 'react'

interface SseStockStreamDemoProps {
  onStatusChange?: (status: { isConnected: boolean; ticksReceived: number; lastTick?: any }) => void
}

const PRODUCT_NAMES: Record<string, string> = {
  'PROD-001': '프리미엄 러닝화',
  'PROD-002': '방수 윈드브레이커',
  'PROD-003': '초경량 트레킹 백팩',
}

export function SseStockStreamDemo({ onStatusChange }: SseStockStreamDemoProps) {
  const [stocks, setStocks] = useState<Record<string, number>>({
    'PROD-001': 45,
    'PROD-002': 14,
    'PROD-003': 88,
  })
  const [isConnected, setIsConnected] = useState(false)
  const [ticksCount, setTicksCount] = useState(0)
  const [eventLogs, setEventLogs] = useState<string[]>([])
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const API_ENDPOINT = '/zone/baseline/file-conventions/route/sse-stock-stream/api'

  const addLog = (msg: string) => {
    setEventLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 5)
    ])
  }

  const startStream = () => {
    if (abortController) {
      abortController.abort()
    }

    const controller = new AbortController()
    setAbortController(controller)
    setIsConnected(true)
    addLog(`SSE 스트림 연결 요청 (${API_ENDPOINT})`)

    fetch(API_ENDPOINT, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status} 응답 실패`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.type === 'INIT') {
                  setStocks(data.stocks)
                  addLog(`초기 재고 로드 완료: ${JSON.stringify(data.stocks)}`)
                  onStatusChange?.({ isConnected: true, ticksReceived: 0 })
                } else if (data.type === 'TICK') {
                  setStocks(prev => ({
                    ...prev,
                    [data.productId]: data.newStock,
                  }))
                  setTicksCount(c => {
                    const next = c + 1
                    onStatusChange?.({ isConnected: true, ticksReceived: next, lastTick: data })
                    return next
                  })
                  const pName = PRODUCT_NAMES[data.productId] || data.productId
                  addLog(`재고 변동 #${data.tickNumber}: ${pName} (${data.delta > 0 ? '+' : ''}${data.delta} -> ${data.newStock}개)`)
                }
              } catch {
                // ignore parse error
              }
            }
          }
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          addLog(`SSE 오류 발생: ${err.message}`)
        }
      })
      .finally(() => {
        setIsConnected(false)
      })
  }

  const stopStream = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }
    setIsConnected(false)
    addLog('사용자에 의해 SSE 스트림 연결 중단됨')
    onStatusChange?.({ isConnected: false, ticksReceived: ticksCount })
  }

  useEffect(() => {
    startStream()
    return () => {
      if (abortController) {
        abortController.abort()
      }
    }
  }, [])

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">실시간 재고 스트리밍 (SSE route.ts)</h4>
            <span className={`rounded px-2 py-0.5 text-[11px] font-mono font-semibold ${
              isConnected
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
            }`}>
              {isConnected ? 'LIVE STREAMING' : 'DISCONNECTED'}
            </span>
          </div>
          <p className="text-xs text-zinc-500">Next.js App Router route.ts의 ReadableStream을 통해 text/event-stream 데이터를 수신합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <button
              onClick={stopStream}
              className="rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
            >
              스트림 일시중지
            </button>
          ) : (
            <button
              onClick={startStream}
              className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
            >
              스트림 다시 연결
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span>실시간 쇼핑몰 재고 현황</span>
            <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">수신 틱: {ticksCount}회</span>
          </div>

          <div className="space-y-2">
            {Object.entries(stocks).map(([id, count]) => (
              <div key={id} className="flex items-center justify-between rounded bg-white p-2.5 shadow-xs border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
                <div>
                  <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">{PRODUCT_NAMES[id] || id}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">{id}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-base font-bold font-mono ${count < 10 ? 'text-rose-600' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    {count}
                  </span>
                  <span className="text-xs text-zinc-500">개</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
          <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1 flex justify-between">
            <span>SSE 이벤트 청크 로그:</span>
            <span className="text-[10px] text-emerald-400">{isConnected ? '● RECEIVING' : '○ IDLE'}</span>
          </div>
          <div className="space-y-1 pt-1 text-[11px]">
            {eventLogs.length > 0 ? (
              eventLogs.map((log, i) => (
                <div key={i} className={i === 0 ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}>
                  {log}
                </div>
              ))
            ) : (
              <div className="text-zinc-600">이벤트 스트림 수신 대기 중...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
