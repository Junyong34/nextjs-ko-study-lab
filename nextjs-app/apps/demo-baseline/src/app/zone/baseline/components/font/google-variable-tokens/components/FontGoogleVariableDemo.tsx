'use client'

import React, { useMemo, useState } from 'react'
import { useVariableFontProbe } from '../hooks/useVariableFontProbe'
import { VerificationFooter } from './VerificationFooter'
import type { FontMeta } from '../types'

interface FontGoogleVariableDemoProps {
  fonts: FontMeta[]
}

export function FontGoogleVariableDemo({ fonts }: FontGoogleVariableDemoProps) {
  const [selectedKey, setSelectedKey] = useState(fonts[0].key)
  const activeFont = useMemo(
    () => fonts.find((f) => f.key === selectedKey) ?? fonts[0],
    [fonts, selectedKey],
  )

  const [weight, setWeight] = useState(activeFont.weightRange.min)
  const [hasInteracted, setHasInteracted] = useState(false)
  // useRef는 attach 시 리렌더를 트리거하지 않으므로, 마운트 시점에 실제 DOM 노드를
  // 확실히 확보하기 위해 콜백 ref + state로 노드를 추적한다.
  const [previewNode, setPreviewNode] = useState<HTMLDivElement | null>(null)

  const probe = useVariableFontProbe(previewNode, activeFont.primaryFamily, activeFont.variableName, weight)

  const handleFontChange = (key: FontMeta['key']) => {
    const next = fonts.find((f) => f.key === key)
    if (!next) return
    setSelectedKey(key)
    // 폰트를 바꾸면 새 폰트의 실제 wght 축 범위 안으로 굵기를 다시 맞춘다 (예: Playfair Display는 400부터 시작).
    setWeight((prev) => Math.min(Math.max(prev, next.weightRange.min), next.weightRange.max))
    setHasInteracted(true)
  }

  const handleWeightChange = (next: number) => {
    setWeight(next)
    setHasInteracted(true)
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. 제어 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
            next/font/google 가변 폰트 CSS 변수 연동 콘솔
          </h4>
          <p className="text-xs text-zinc-500">
            굵기 슬라이더는 여러 정적 파일이 아니라, 하나의 가변 폰트 파일 안 wght 축을 실시간으로 보간합니다.
          </p>
        </div>

        <div className="flex gap-2">
          {fonts.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => handleFontChange(f.key)}
              className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${
                selectedKey === f.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 타이포그래피 실시간 프리뷰 — className은 next/font/google이 생성한 실제 값이다 */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-bold text-zinc-600 dark:text-zinc-400">
            적용된 폰트: <strong>{activeFont.label}</strong>
          </span>
          <div className="flex items-center gap-2">
            <span>
              굵기(wght): <strong className="font-mono">{weight}</strong>
            </span>
            <input
              type="range"
              min={activeFont.weightRange.min}
              max={activeFont.weightRange.max}
              step={1}
              value={weight}
              onChange={(e) => handleWeightChange(Number(e.target.value))}
              className="w-32"
            />
            <span className="font-mono text-[10px] text-zinc-400">
              {activeFont.weightRange.min}–{activeFont.weightRange.max}
            </span>
          </div>
        </div>

        <div
          ref={setPreviewNode}
          className={activeFont.variableClassName}
          style={{
            fontFamily: `var(${activeFont.variableName})`,
            fontWeight: weight,
          }}
        >
          <div className="rounded-md bg-white p-4 text-zinc-900 shadow-2xs dark:bg-zinc-950 dark:text-zinc-100 space-y-1.5 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-base">Pro Wireless Mechanical Keyboard</span>
              <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                $189.00
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              The quick brown fox jumps over the lazy dog. 1234567890. One variable font file renders every weight.
            </p>
          </div>
        </div>
      </div>

      {/* 3. next/font/google이 실제로 반환한 값 — 하드코딩 문자열이 아니라 빌드 결과 그대로 노출 */}
      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1.5">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
          {activeFont.label}() 반환 객체 (빌드 타임 실제 값):
        </div>
        <div className="space-y-1 text-[11px] break-all">
          <div>
            • variable: <span className="text-emerald-400 font-bold">{activeFont.variableName}</span>
          </div>
          <div>
            • style.fontFamily: <span className="text-blue-300">{activeFont.fontFamily}</span>
          </div>
          <div>
            • weight 옵션: <span className="text-amber-300">생략 (기본값 &apos;variable&apos; → wght {activeFont.weightRange.min}~{activeFont.weightRange.max} 자동 적용)</span>
          </div>
          <div>
            • display: <span className="text-purple-300">swap</span>
          </div>
        </div>
      </div>

      <VerificationFooter font={activeFont} weight={weight} hasInteracted={hasInteracted} probe={probe} />
    </div>
  )
}
