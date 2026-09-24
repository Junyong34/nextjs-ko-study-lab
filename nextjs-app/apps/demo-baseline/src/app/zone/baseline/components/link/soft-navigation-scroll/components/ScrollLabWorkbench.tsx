'use client'

import { useEffect, useRef, useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { MSG_FRAME_READY, MSG_NAV_RECORD, VIEWPORT_BASE } from '../types'
import type { FrameReadyMessage, NavRecord, NavRecordMessage } from '../types'
import { NavRecordTable } from './NavRecordTable'
import { ScrollVerification } from './ScrollVerification'

const FRAME_SRC = `${VIEWPORT_BASE}/1`

/**
 * 2단(실습) + 3단(검증)을 묶는 클라이언트 컴포넌트.
 * 실제 스크롤은 아래 iframe 문서(viewport/[chapter])에서 일어나고, 그 문서가 실측한 값을
 * postMessage로 받아 표와 검증 패널에 그대로 표시한다. 이 컴포넌트는 값을 계산하거나 만들지 않는다.
 */
export function ScrollLabWorkbench() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [records, setRecords] = useState<NavRecord[]>([])
  /** iframe 문서가 처음 로드됐을 때의 performance.timeOrigin */
  const [baseTimeOrigin, setBaseTimeOrigin] = useState<number | null>(null)
  /** FRAME_READY로 받은 서로 다른 timeOrigin 목록 = iframe 문서가 로드된 횟수 (dev StrictMode 중복 제거) */
  const [loadOrigins, setLoadOrigins] = useState<number[]>([])
  const frameLoads = loadOrigins.length

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.source !== frameRef.current?.contentWindow) return
      const data = event.data as FrameReadyMessage | NavRecordMessage | null
      if (!data || typeof data !== 'object') return
      if (data.type === MSG_FRAME_READY) {
        setLoadOrigins((prev) => (prev.includes(data.timeOrigin) ? prev : [...prev, data.timeOrigin]))
        // 첫 로드만 기준으로 삼는다. 이후 READY가 또 오면 = 하드 리로드가 있었다는 증거.
        setBaseTimeOrigin((prev) => prev ?? data.timeOrigin)
      } else if (data.type === MSG_NAV_RECORD) {
        setRecords((prev) => [...prev, data.record])
        // READY를 놓친 경우(리스너 부착 전 로드)에도 첫 기록의 timeOrigin을 기준으로 삼는다
        setBaseTimeOrigin((prev) => prev ?? data.record.timeOrigin)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const handleReset = () => {
    setRecords([])
    setBaseTimeOrigin(null)
    setLoadOrigins([])
    // 초기화는 의도적인 하드 리로드: 새 문서, 새 timeOrigin, 레이아웃 카운터 0부터
    frameRef.current?.contentWindow?.location.replace(FRAME_SRC)
  }

  return (
    <>
      <DemoPlaygroundCard title="<Link scroll> 실측 — 실제 라우트: viewport/[chapter]" className="min-w-0">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="max-w-xl text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              아래 창은 <code>viewport/[chapter]</code> 라우트를 띄운 <strong>독립 문서</strong>입니다. 창 안에서 휠로
              스크롤하거나 <strong>[아래로 900px]</strong>을 누른 뒤, 상단 sticky 헤더의 링크를 누르세요. 스크롤은
              Next.js 라우터만 움직이며 이 데모 코드는 <code>scrollY</code>를 읽기만 합니다.
            </p>
            <DemoResetButton onReset={handleReset} label="기록 초기화 (문서 새로 로드)" />
          </div>

          <iframe
            ref={frameRef}
            src={FRAME_SRC}
            title="<Link scroll> 실측용 스크롤 문서"
            className="h-[440px] w-full rounded border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950"
          />

          <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
            <span>iframe 문서 로드 횟수: {frameLoads}</span>
            <span>기준 timeOrigin: {baseTimeOrigin === null ? '-' : Math.round(baseTimeOrigin)}</span>
            <span>기록된 클릭: {records.length}건</span>
          </div>

          <NavRecordTable records={records} baseTimeOrigin={baseTimeOrigin} />
        </div>
      </DemoPlaygroundCard>

      <ScrollVerification records={records} baseTimeOrigin={baseTimeOrigin} frameLoads={frameLoads} />
    </>
  )
}
