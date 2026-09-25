'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { ObservedChunk, ProbeResponse, StreamChunk } from '../types'
import { base64FromUtf8, sha256Hex, utf8Bytes } from '../web-std'

export const DEFAULT_INPUT = 'orderId=8921&memo=엣지 런타임 ✓'

/** 같은 입력을 브라우저의 Web API로 계산한 값 — edge 응답과 대조한다. */
export interface BrowserSide {
  sha256Hex: string
  utf8ByteLength: number
  base64: string
}

export interface StreamResult {
  httpStatus: number
  nextRuntime: string | null
  edgeRuntimeGlobal: string | null
  headersAtMs: number
  chunks: ObservedChunk[]
}

export type LabState =
  | { status: 'idle' }
  | { status: 'running'; chunks: ObservedChunk[] }
  | { status: 'done'; input: string; probe: ProbeResponse; browser: BrowserSide; stream: StreamResult }
  | { status: 'error'; message: string }

async function fetchProbe(base: string, input: string): Promise<ProbeResponse> {
  const res = await fetch(`${base}/probe?${new URLSearchParams({ input })}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`probe HTTP ${res.status}`)
  return (await res.json()) as ProbeResponse
}

/** NDJSON 응답을 reader로 한 조각씩 읽으며, 각 줄이 브라우저에 도착한 시각을 기록한다. */
async function readStream(base: string, input: string, onChunk: (c: ObservedChunk[]) => void): Promise<StreamResult> {
  const t0 = performance.now()
  const res = await fetch(`${base}/stream?${new URLSearchParams({ input })}`, { cache: 'no-store' })
  const headersAtMs = Math.round(performance.now() - t0)
  if (!res.ok || !res.body) throw new Error(`stream HTTP ${res.status}`)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  const chunks: ObservedChunk[] = []
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    const arrivedMs = Math.round(performance.now() - t0)
    for (const line of lines.filter(Boolean)) {
      chunks.push({ ...(JSON.parse(line) as StreamChunk), arrivedMs })
    }
    onChunk([...chunks])
  }
  return {
    httpStatus: res.status,
    nextRuntime: res.headers.get('x-next-runtime'),
    edgeRuntimeGlobal: res.headers.get('x-edge-runtime-global'),
    headersAtMs,
    chunks,
  }
}

export function useEdgeLab() {
  const pathname = usePathname()
  const [input, setInput] = useState(DEFAULT_INPUT)
  const [state, setState] = useState<LabState>({ status: 'idle' })

  const run = useCallback(
    async (value: string) => {
      setState({ status: 'running', chunks: [] })
      try {
        const [probe, browserHex] = await Promise.all([fetchProbe(pathname, value), sha256Hex(value)])
        const browser: BrowserSide = {
          sha256Hex: browserHex,
          utf8ByteLength: utf8Bytes(value).byteLength,
          base64: base64FromUtf8(value),
        }
        const stream = await readStream(pathname, value, (chunks) => setState({ status: 'running', chunks }))
        setState({ status: 'done', input: value, probe, browser, stream })
      } catch (error) {
        setState({ status: 'error', message: error instanceof Error ? error.message : String(error) })
      }
    },
    [pathname],
  )

  // 진입 시 기본 입력으로 한 번 실제 호출한다.
  useEffect(() => {
    void run(DEFAULT_INPUT)
  }, [run])

  const reset = useCallback(() => {
    setInput(DEFAULT_INPUT)
    void run(DEFAULT_INPUT)
  }, [run])

  return { input, setInput, state, run, reset }
}
