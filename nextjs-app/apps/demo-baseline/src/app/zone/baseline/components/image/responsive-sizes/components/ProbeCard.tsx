'use client'

import React from 'react'
import type { ImgProbe } from '../types'
import { PHOTO_PATH } from '../lib/imageSetup'

interface ProbeCardProps {
  title: string
  code: string
  probe: ImgProbe | null
  children: React.ReactNode
}

function shortUrl(url: string) {
  try {
    const u = new URL(url)
    return `…/photo${u.search}`
  } catch {
    return url
  }
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-2">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="break-all text-zinc-800 dark:text-zinc-200">{value}</dd>
    </div>
  )
}

/** 이미지 한 장과, 그 <img>에서 DOM으로 직접 읽은 값을 나란히 보여 주는 카드 */
export function ProbeCard({ title, code, probe, children }: ProbeCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2.5 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      <div>
        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{title}</div>
        <code className="mt-1 block break-all font-mono text-[10px] leading-relaxed text-zinc-500">{code}</code>
      </div>
      {children}
      <dl className="space-y-1 font-mono text-[10px] leading-relaxed">
        {probe === null ? (
          <div className="text-zinc-500">이미지 로드 대기 중…</div>
        ) : (
          <>
            <Row label="srcset" value={probe.srcsetAttr?.replaceAll(PHOTO_PATH, '…/photo') ?? '(속성 없음)'} />
            <Row label="sizes" value={probe.sizesAttr ?? '(속성 없음)'} />
            <Row label="sizes 평가값" value={probe.slotWidth === null ? '-' : `${probe.slotWidth}px`} />
            <Row label="currentSrc" value={shortUrl(probe.currentSrc)} />
            <Row
              label="선택 후보"
              value={probe.chosen ? `${probe.chosen.value}${probe.chosen.kind}` : '-'}
            />
            <Row label="naturalWidth" value={probe.naturalWidth} />
            <Row label="파일 폭" value={probe.fileWidth === null ? '측정 중' : `${probe.fileWidth}px`} />
            <Row
              label="렌더 박스"
              value={`${probe.boxWidth}×${probe.boxHeight} (${probe.position})`}
            />
          </>
        )}
      </dl>
    </div>
  )
}
