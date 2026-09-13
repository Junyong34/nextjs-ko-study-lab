'use client'

import React, { useState } from 'react'
import { useFontFaceProbe } from '../hooks/useFontFaceProbe'
import { VerificationFooter } from './VerificationFooter'
import type { LocalFontWeight } from '../types'

interface FontLocalFontFaceDemoProps {
  /** next/font/local이 생성한 실제 className */
  className: string
  /** next/font/local이 생성한 실제 font-family 문자열 (fallback 포함) */
  fontFamily: string
  /** fontFamily에서 추출한 1차 family 이름 (document.fonts 조회용) */
  primaryFamily: string
  /** weight별 실제 로컬 .woff2 파일 매핑 */
  sources: Array<{ path: string; weight: LocalFontWeight }>
}

export function FontLocalFontFaceDemo({
  className,
  fontFamily,
  primaryFamily,
  sources,
}: FontLocalFontFaceDemoProps) {
  const [weight, setWeight] = useState<LocalFontWeight>('400')
  const [hasInteracted, setHasInteracted] = useState(false)
  // useRef는 attach 시 리렌더를 트리거하지 않으므로, 마운트 시점에 실제 DOM 노드를
  // 확실히 확보하기 위해 콜백 ref + state로 노드를 추적한다.
  const [previewNode, setPreviewNode] = useState<HTMLDivElement | null>(null)

  const probe = useFontFaceProbe(previewNode, primaryFamily, weight)
  const activeSource = sources.find((s) => s.weight === weight)

  const handleWeightChange = (nextWeight: LocalFontWeight) => {
    setWeight(nextWeight)
    setHasInteracted(true)
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. 제어 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
            next/font/local 로컬 폰트 @font-face 매핑 콘솔
          </h4>
          <p className="text-xs text-zinc-500">
            굵기(weight)를 바꾸면 실제로 다른 .woff2 파일에 매핑된 @font-face 규칙이 적용됩니다.
          </p>
        </div>

        <div className="flex gap-1.5">
          {(['400', '700'] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => handleWeightChange(w)}
              className={`rounded px-2.5 py-1 font-mono text-xs font-semibold cursor-pointer transition ${
                weight === w
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              w{w}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 로컬 폰트 프리뷰 — className이 실제 next/font/local 클래스다 */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>
            매핑된 로컬 파일: <strong className="text-zinc-800 dark:text-zinc-200">{activeSource?.path}</strong>
          </span>
          <span className="font-mono font-bold">weight: {weight}</span>
        </div>

        <div
          ref={setPreviewNode}
          style={{ fontWeight: Number(weight) }}
          className={`${className} rounded-md bg-white p-4 text-zinc-900 shadow-2xs dark:bg-zinc-950 dark:text-zinc-100 space-y-1`}
        >
          <div className="text-base">Next.js 로컬 폰트 셀프호스팅 실습</div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            이 문단은 next/font/local이 빌드 타임에 생성한 실제 className이 적용된 결과입니다.
          </p>
        </div>
      </div>

      {/* 3. next/font/local이 실제로 반환한 값 — 하드코딩 문자열이 아니라 빌드 결과 그대로 노출 */}
      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1.5">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
          localFont() 반환 객체 (빌드 타임 실제 값):
        </div>
        <div className="space-y-1 text-[11px] break-all">
          <div>
            • className: <span className="text-emerald-400 font-bold">{className}</span>
          </div>
          <div>
            • style.fontFamily: <span className="text-blue-300">{fontFamily}</span>
          </div>
          <div>
            • src[{weight}]: <span className="text-amber-300">{activeSource?.path}</span>
          </div>
        </div>
      </div>

      <VerificationFooter
        weight={weight}
        primaryFamily={primaryFamily}
        hasInteracted={hasInteracted}
        probe={probe}
      />
    </div>
  )
}
