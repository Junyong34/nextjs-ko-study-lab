'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import type { SizesPresetId } from '../types'
import { SIZES_PRESETS, buildPhotoSrc, getOptimizedImgProps, photoLoader } from '../lib/imageSetup'
import { judgeAppImage, judgeFixedWidth, judgeOptimizedFill } from '../lib/verdict'
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

  // 이 앱 설정과 무관하게 Next.js 기본 이미지 설정(unoptimized: false)으로 계산한 <img> 속성
  const optimizedFill = getOptimizedImgProps({ src, alt: '최적화 fill 상품 사진', fill: true, sizes: preset.sizes })
  const optimizedFixed = getOptimizedImgProps({ src, alt: '고정 크기 썸네일', width: 320, height: 160 })
  const sizesCode = preset.sizes ? ` sizes="${preset.sizes}"` : ''

  const verdicts = [
    probeA && judgeAppImage(probeA),
    probeB && judgeOptimizedFill(probeB, preset),
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
              title="B. 최적화가 켜진 앱이라면: fill + sizes"
              code={`getImgProps({ fill${sizesCode} }, unoptimized:false)`}
              probe={probeB}
            >
              <div className={SLOT}>
                {/* getImgProps가 만든 <img> props(alt·srcSet·sizes·style 포함)를 그대로 펼친다 */}
                <img key={tag} ref={refB} {...optimizedFill} className="object-cover" />
              </div>
            </ProbeCard>
            <ProbeCard
              title="C. 최적화가 켜진 앱이라면: 고정 width, sizes 없음"
              code="getImgProps({ width: 320, height: 160 }, unoptimized:false)"
              probe={probeC}
            >
              <div className="relative overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
                {/* getImgProps가 만든 <img> props(alt·srcSet·sizes·style 포함)를 그대로 펼친다 */}
                <img key={tag} ref={refC} {...optimizedFixed} className="h-auto max-w-full" />
              </div>
            </ProbeCard>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter preset={preset} verdicts={verdicts} />
    </>
  )
}
