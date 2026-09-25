'use client'

import { useEffect, useRef, useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { CATALOG_PATH, DEFAULT_CATEGORY, MSG_FRAME_READY, MSG_NAV_RECORD } from '../types'
import type { FrameReadyMessage, NavRecord, NavRecordMessage } from '../types'
import { RecordTable } from './RecordTable'
import { RetentionVerification } from './RetentionVerification'

const FRAME_SRC = `${CATALOG_PATH}?cat=${DEFAULT_CATEGORY}`

/**
 * 2단(실습) + 3단(검증)을 묶는 클라이언트 컴포넌트.
 * 실제 스크롤과 이동은 아래 iframe 문서(catalog?cat=…)에서 일어나고, 그 문서가 실측한 값을
 * postMessage로 받아 표와 검증 패널에 그대로 표시한다. 이 컴포넌트는 값을 계산하거나 만들지 않는다.
 */
export function RetentionWorkbench() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [records, setRecords] = useState<NavRecord[]>([])
  /** iframe 문서가 처음 로드됐을 때의 performance.timeOrigin */
  const [baseTimeOrigin, setBaseTimeOrigin] = useState<number | null>(null)
  /** READY로 받은 서로 다른 timeOrigin = iframe 문서가 로드된 횟수 (dev StrictMode 중복 제거) */
  const [loadOrigins, setLoadOrigins] = useState<number[]>([])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.source !== frameRef.current?.contentWindow) return
      const data = event.data as FrameReadyMessage | NavRecordMessage | null
      if (!data || typeof data !== 'object') return
      if (data.type === MSG_FRAME_READY) {
        setLoadOrigins((prev) => (prev.includes(data.timeOrigin) ? prev : [...prev, data.timeOrigin]))
        // 첫 로드만 기준으로 삼는다. 이후 READY가 또 오면 = 문서 리로드가 있었다는 증거.
        setBaseTimeOrigin((prev) => prev ?? data.timeOrigin)
      } else if (data.type === MSG_NAV_RECORD) {
        setRecords((prev) => [...prev, data.record])
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
    // 초기화는 의도적인 하드 리로드: 새 문서, 새 timeOrigin, 카운터 0부터
    frameRef.current?.contentWindow?.location.replace(FRAME_SRC)
  }

  return (
    <>
      <DemoPlaygroundCard title="필터 변경 방법 5종 실측 — 실제 라우트: catalog?cat=…" className="min-w-0">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="max-w-xl text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              아래 창은 <code>catalog</code> 라우트(Server Component가 <code>searchParams</code>로 목록을 렌더링)를 띄운{' '}
              <strong>독립 문서</strong>입니다. <strong>[측정 준비]</strong>를 누르거나 두 패널과 문서를 직접 스크롤한 뒤,
              헤더의 필터 버튼을 누르세요. 버튼마다 pathname은 같고 <code>?cat=</code>만 다음 카테고리로 바뀝니다.
            </p>
            <DemoResetButton onReset={handleReset} label="기록 초기화 (문서 새로 로드)" />
          </div>

          <iframe
            ref={frameRef}
            src={FRAME_SRC}
            title="searchParams 필터 스크롤 실측용 카탈로그 문서"
            className="h-[460px] w-full rounded border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950"
          />

          <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
            <span>iframe 문서 로드 횟수: {loadOrigins.length}</span>
            <span>기준 timeOrigin: {baseTimeOrigin === null ? '-' : Math.round(baseTimeOrigin)}</span>
            <span>기록된 필터 변경: {records.length}건</span>
          </div>

          <RecordTable records={records} baseTimeOrigin={baseTimeOrigin} />
        </div>
      </DemoPlaygroundCard>

      <RetentionVerification records={records} baseTimeOrigin={baseTimeOrigin} frameLoads={loadOrigins.length} />
    </>
  )
}
