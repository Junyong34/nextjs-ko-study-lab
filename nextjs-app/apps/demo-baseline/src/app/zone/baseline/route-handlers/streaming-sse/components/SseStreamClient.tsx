'use client'

import React, { useState, useEffect, useRef } from 'react'

const SSE_ENDPOINT = '/zone/baseline/route-handlers/streaming-sse/api/sse'

interface SsePacket {
  step?: number
  timestamp?: string
  serverCpu?: number
  memoryUsage?: string
  message?: string
  status?: string
}

export function SseStreamClient() {
  const [packets, setPackets] = useState<SsePacket[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [statusMessage, setStatusMessage] = useState('대기 중: [SSE 스트리밍 시작]을 눌러 연결하세요.')
  const eventSourceRef = useRef<EventSource | null>(null)

  const startStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setPackets([])
    setIsConnected(true)
    setStatusMessage('● SSE 파이프라인 연결됨: 서버에서 청크 스트리밍 수신 중...')

    const es = new EventSource(SSE_ENDPOINT)
    eventSourceRef.current = es

    es.onmessage = (event) => {
      try {
        const data: SsePacket = JSON.parse(event.data)
        setPackets((prev) => [...prev, data])

        if (data.status === 'completed') {
          setStatusMessage('[확인] 스트리밍 완료 (총 6개 패킷 전송 성공)')
          es.close()
          setIsConnected(false)
        }
      } catch (err) {
        console.error('SSE JSON Parse Error:', err)
      }
    }

    es.onerror = () => {
      setStatusMessage('[주의]️ 스트림 연결 종료됨')
      es.close()
      setIsConnected(false)
    }
  }

  const stopStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setIsConnected(false)
    setStatusMessage('스트리밍이 사용자에 의해 중단되었습니다.')
  }

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* 1. 스트리밍 컨트롤 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          {!isConnected ? (
            <button
              type="button"
              onClick={startStreaming}
              className="inline-flex items-center gap-1.5 rounded bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 cursor-pointer"
            >
              <span>▶ SSE 스트리밍 시작</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopStreaming}
              className="inline-flex items-center gap-1.5 rounded bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 cursor-pointer"
            >
              <span>⏹ 스트림 중단</span>
            </button>
          )}

          <span className="font-mono text-[11px] text-zinc-500">
            엔드포인트: {SSE_ENDPOINT}
          </span>
        </div>

        <span
          className={`rounded px-2 py-0.5 font-mono text-[11px] font-bold ${
            isConnected
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse'
              : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
          }`}
        >
          {isConnected ? 'LIVE STREAMING' : 'IDLE'}
        </span>
      </div>

      {/* 2. 실시간 터미널 로그 콘솔 */}
      <div className="overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 text-white shadow-md">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs font-mono text-zinc-400">
          <span>SERVER-SENT-EVENTS TERMINAL CONSOLE</span>
          <span>{packets.length} / 6 PACKETS</span>
        </div>

        <div className="max-h-64 overflow-y-auto p-4 font-mono text-xs space-y-2">
          <div className="text-zinc-500">• {statusMessage}</div>
          {packets.map((pkt, idx) => (
            <div
              key={idx}
              className="rounded bg-zinc-900/90 p-2 text-zinc-200 border border-zinc-800 flex flex-wrap items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-950 px-1.5 py-0.2 text-[10px] text-emerald-400 font-bold border border-emerald-800">
                  #{pkt.step || 'END'}
                </span>
                <span>{pkt.message}</span>
              </div>
              {pkt.serverCpu && (
                <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                  <span>CPU: {pkt.serverCpu}%</span>
                  <span>MEM: {pkt.memoryUsage} MB</span>
                  <span>[{pkt.timestamp}]</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
