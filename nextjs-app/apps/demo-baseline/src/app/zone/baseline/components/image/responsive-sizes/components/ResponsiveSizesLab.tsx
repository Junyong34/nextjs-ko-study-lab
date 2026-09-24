'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import type { SizesPresetId } from '../types'
import {
  ALL_WIDTHS,
  FIXED_WIDTH,
  SIZES_PRESETS,
  buildDensitySrcset,
  buildPhotoSrc,
  buildWidthSrcset,
  photoLoader,
  photoUrl,
} from '../lib/imageSetup'
import { judgeAppImage, judgeFixedWidth, judgeNativeFill } from '../lib/verdict'
import { useImgProbe } from './useImgProbe'
import { ProbeCard } from './ProbeCard'
import { VerificationFooter } from './VerificationFooter'

const SLOT = 'relative aspect-[2/1] w-full overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900'

export function ResponsiveSizesLab() {
  const [presetId, setPresetId] = useState<SizesPresetId>('grid')
  const [run, setRun] = useState(0)
  const preset = SIZES_PRESETS.find((p) => p.id === presetId) ?? SIZES_PRESETS[0]
  const tag = `${presetId}-${run}`
  const src = buildPhotoSrc(run)

  const refA = useRef<HTMLImageElement>(null)
  const refB = useRef<HTMLImageElement>(null)
  const refC = useRef<HTMLImageElement>(null)
  const probeA = useImgProbe(refA, tag)
  const probeB = useImgProbe(refB, tag)
  const probeC = useImgProbe(refC, tag)

  // B·C는 next/image가 아니라 직접 작성한 네이티브 srcset이다(후보 폭은 공식 문서의 기본 imageSizes·deviceSizes).
  const widthSrcset = buildWidthSrcset(src, ALL_WIDTHS)
  const densitySrcset = buildDensitySrcset(src)
  const sizesCode = preset.sizes ? ` sizes="${preset.sizes}"` : ''

  const verdicts = [
    probeA && judgeAppImage(probeA),
    probeB && judgeNativeFill(probeB, preset),
    probeC && judgeFixedWidth(probeC),
  ]

  return (
    <>
      <DemoPlaygroundCard title="상품 카드 그리드 — 실제 파일: components/ResponsiveSizesLab.tsx, photo/route.ts">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {SIZES_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  title={p.hint}
                  onClick={() => setPresetId(p.id)}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                    presetId === p.id
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                className="cursor-pointer rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                캐시 없이 다시 요청
              </button>
              <DemoResetButton
                onReset={() => {
                  setPresetId('grid')
                  setRun(0)
                }}
                label="초기화"
              />
            </div>
          </div>

          <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            현재 뷰포트 {probeB ? `${probeB.viewportWidth}px · DPR ${probeB.dpr}` : '측정 중'} — 창(또는 셸 iframe) 폭을
            767px 이하/이상으로 바꾸면 그리드가 1열↔3열로 바뀌고, 선택된 후보가 다시 계산됩니다. 크게 받은 후보는 창을 줄여도
            브라우저가 그대로 재사용할 수 있으니 줄인 뒤에는 [캐시 없이 다시 요청]으로 새로 고르게 하세요.
          </p>
          <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            A만 next/image입니다. 이 앱은 <code>images.unoptimized: true</code>라 A에는 srcset이 렌더되지 않습니다.
            B·C는 next/image가 생성한 것이 아니라, 공식 문서의 기본 <code>imageSizes</code>·<code>deviceSizes</code> 값으로 직접 작성한
            네이티브 <code>&lt;img srcSet sizes&gt;</code>이며 브라우저의 srcset 선택 원리를 보여 줍니다.
          </p>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <ProbeCard
              title="A. 이 앱의 실제 <Image> (images.unoptimized: true)"
              code={`<Image fill${sizesCode} loader={photoLoader} />`}
              probe={probeA}
            >
              <div className={SLOT}>
                <Image
                  key={tag}
                  ref={refA}
                  src={src}
                  alt="이 앱의 next/image fill 상품 사진"
                  fill
                  sizes={preset.sizes}
                  loader={photoLoader}
                  // 모바일에서 첫 화면 LCP가 되므로 dev 경고를 피하려 eager로 둔다(srcset/sizes 판정과 무관).
                  loading="eager"
                  className="object-cover"
                />
              </div>
            </ProbeCard>
            <ProbeCard
              title="B. 브라우저 네이티브 <img srcSet sizes> — next/image 아님"
              code={`<img srcSet="…?w=32 32w, …, …?w=3840 3840w"${sizesCode} />`}
              probe={probeB}
            >
              <div className={SLOT}>
                {/* 직접 작성한 srcset을 브라우저가 sizes로 고르는 원리만 본다. A와 같은 레이아웃을 CSS로 준다. */}
                <img
                  key={tag}
                  ref={refB}
                  src={photoUrl(src, ALL_WIDTHS[ALL_WIDTHS.length - 1])}
                  srcSet={widthSrcset}
                  sizes={preset.sizes}
                  alt="네이티브 srcset 상품 사진"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </ProbeCard>
            <ProbeCard
              title="C. 브라우저 네이티브 <img srcSet 1x/2x> — next/image 아님"
              code={`<img width={${FIXED_WIDTH}} srcSet="…?w=${FIXED_WIDTH} 1x, …?w=${FIXED_WIDTH * 2} 2x" />`}
              probe={probeC}
            >
              <div className="relative overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
                <img
                  key={tag}
                  ref={refC}
                  src={photoUrl(src, FIXED_WIDTH)}
                  srcSet={densitySrcset}
                  width={FIXED_WIDTH}
                  height={FIXED_WIDTH / 2}
                  alt="고정 크기 썸네일"
                  className="h-auto max-w-full"
                />
              </div>
            </ProbeCard>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter preset={preset} verdicts={verdicts} />
    </>
  )
}
