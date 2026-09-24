'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { DrawerReport } from '../types'
import { SLOTS, SLOT_EXPECTATIONS, SLOT_LABELS, verifyPlacement } from '../verification'
import { usePlacementObserver } from './PlacementObserver'

function summary(report: DrawerReport | undefined) {
  if (!report) return '—'
  return `${report.mountId.slice(0, 6)} / ${report.open ? '열림' : '닫힘'} / "${report.memo}" / ${report.scrollTop}px`
}

export function VerificationFooter() {
  const { before, after } = usePlacementObserver()
  const result = verifyPlacement(before, after)

  const expected = (
    <div className="space-y-1">
      {SLOTS.map((slot) => (
        <p key={slot}>
          • {SLOT_LABELS[slot]}:{' '}
          {SLOT_EXPECTATIONS[slot] === 'preserve'
            ? '같은 mount ID, 열림·메모·스크롤 유지'
            : '새 mount ID, 닫힘·빈 메모·scroll 0'}
        </p>
      ))}
      <p>• Link 이동이므로 문서 재로드 없음(performance.timeOrigin 동일)</p>
    </div>
  )

  const actual = (
    <div className="space-y-2">
      <p className="text-[11px] text-zinc-500">형식: mount / 열림 / 메모 / scrollTop</p>
      {SLOTS.map((slot) => {
        const verdict = result.slots.find((item) => item.slot === slot)
        return (
          <div key={slot} data-testid={`verdict-${slot}`}>
            <p className="font-semibold">{SLOT_LABELS[slot]}</p>
            <p>이동 전: {summary(before?.drawers[slot])}</p>
            <p>이동 직후: {summary(after?.drawers[slot])}</p>
            {verdict && <p>→ {verdict.ok ? '[일치] ' : '[불일치] '}{verdict.detail}</p>}
          </div>
        )
      })}
      <p>
        • 문서 timeOrigin: {before ? before.timeOrigin.toFixed(1) : '—'} →{' '}
        {after ? after.timeOrigin.toFixed(1) : '—'}
      </p>
      <p>• {result.reason}</p>
    </div>
  )

  return (
    <ExpectedActualPanel
      title="Drawer 배치별 보존·초기화 대조"
      className="min-w-0 break-all"
      expected={expected}
      actual={actual}
      isMatched={result.isMatched}
      description="이동 전 기록과, 이동 후 세 Drawer가 새 경로에서 처음 보고한 값(이동 직후 스냅샷)을 비교합니다. 이동 뒤 조작은 판정에 영향을 주지 않습니다."
    />
  )
}
