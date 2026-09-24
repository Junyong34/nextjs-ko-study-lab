'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { changeQtyWithRevalidateTagMax, changeQtyWithUpdateTag } from '../actions'
import type { CartLineSnapshot, LineId, LineView, SyncRun } from '../types'
import { CartLineCard } from './CartLineCard'
import { SyncResultPanel } from './SyncResultPanel'
import { RouteHandlerProbe } from './RouteHandlerProbe'

const ACTIONS = { update: changeQtyWithUpdateTag, revalidate: changeQtyWithRevalidateTagMax }

const PHASE_LABEL: Record<SyncRun['phase'], string> = {
  action: 'Server Action 실행 중... (원본 변경 + 태그 무효화)',
  refresh: '액션 응답 반영 완료, 이어서 첫 재요청(router.refresh) 중...',
  done: '',
}

export function CartWorkbench({ lines }: { lines: CartLineSnapshot[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [runs, setRuns] = useState<SyncRun[]>([])
  const latest = runs[0]
  const busy = isPending || (latest !== undefined && latest.phase !== 'done')

  const viewOf = (lineId: LineId): LineView => {
    const { cached, source } = lines.find((l) => l.lineId === lineId)!
    return { cached, source }
  }
  const patchLatest = (patch: Partial<SyncRun>) => setRuns(([head, ...rest]) => [{ ...head, ...patch }, ...rest])

  // 각 단계의 transition이 커밋된 뒤(= 서버가 그린 새 props가 화면에 반영된 뒤) 화면 값을 기록한다
  useEffect(() => {
    if (!latest || isPending || latest.error) return
    if (latest.phase === 'action' && latest.result) {
      patchLatest({ afterAction: viewOf(latest.lineId), phase: 'refresh' })
      startTransition(() => router.refresh())
    } else if (latest.phase === 'refresh') {
      patchLatest({ afterRefresh: viewOf(latest.lineId), phase: 'done' })
    }
  }, [latest, isPending, lines]) // viewOf·patchLatest는 lines·setRuns만 참조한다

  const change = (lineId: LineId, delta: number) => {
    const line = lines.find((l) => l.lineId === lineId)!
    const run: SyncRun = { id: Date.now(), lineId, api: line.api, phase: 'action', before: viewOf(lineId) }
    setRuns((r) => [run, ...r].slice(0, 6))
    startTransition(async () => {
      try {
        const result = await ACTIONS[lineId](delta)
        patchLatest({ result })
      } catch (e) {
        patchLatest({ error: e instanceof Error ? e.message : String(e), phase: 'done' })
      }
    })
  }

  return (
    <>
      <DemoPlaygroundCard title="장바구니 수량 변경: updateTag vs revalidateTag(tag, 'max')">
        <div className="space-y-4">
          <p className="text-[11px] text-zinc-500" aria-live="polite">
            {busy && latest
              ? `${latest.api} — ${PHASE_LABEL[latest.phase] || '마무리 중...'}`
              : '+/− 버튼은 서버 메모리의 원본 수량을 바꾼 뒤 각 줄에 지정된 API로 태그를 무효화합니다. 가운데 수량은 캐시 함수가 반환한 값입니다.'}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {lines.map((line) => (
              <CartLineCard
                key={line.lineId}
                line={line}
                disabled={busy}
                onChange={(delta) => change(line.lineId, delta)}
              />
            ))}
          </div>
          {latest?.error && <p className="text-[11px] text-rose-600">액션 오류: {latest.error}</p>}
          <RouteHandlerProbe />
          <div className="flex justify-end">
            <DemoResetButton label="측정 기록 지우기" disabled={busy} onReset={() => setRuns([])} />
          </div>
        </div>
      </DemoPlaygroundCard>

      <SyncResultPanel runs={runs} />
    </>
  )
}
