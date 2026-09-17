'use client'

import React, { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import type { PreloadVariant } from '../types'
import { VARIANTS, buildHeroImageUrl } from './variantConfig'
import { useRealHeadCheck } from './useRealHeadCheck'
import { VerificationFooter } from './VerificationFooter'

const VARIANT_PROPS: Record<PreloadVariant, { priority?: true; preload?: true }> = {
  none: {},
  priority: { priority: true },
  preload: { preload: true },
}

export function ImagePriorityLcpDemo() {
  const [variant, setVariant] = useState<PreloadVariant>('none')
  const imgRef = useRef<HTMLImageElement>(null)

  const heroImageUrl = useMemo(() => buildHeroImageUrl(variant), [variant])
  const { actual, expected, isMatched } = useRealHeadCheck(variant, heroImageUrl, imgRef)

  return (
    <>
      <DemoPlaygroundCard title="상품 상세 히어로 배너 — next/image 실제 파일: components/ImagePriorityLcpDemo.tsx">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1.5">
              {VARIANTS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariant(v.id)}
                  title={v.hint}
                  className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${
                    variant === v.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {v.label}
                  {v.deprecated && <span className="ml-1 opacity-70">(deprecated)</span>}
                </button>
              ))}
            </div>
            <DemoResetButton onReset={() => setVariant('none')} label="기본값으로 초기화" />
          </div>

          <div className="relative aspect-[12/5] w-full overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-800">
            <Image
              ref={imgRef}
              key={variant}
              src={heroImageUrl}
              alt="상품 상세 히어로 배너"
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              {...VARIANT_PROPS[variant]}
              className="object-cover"
            />
          </div>

          <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-[11px] text-zinc-300 dark:border-zinc-800 space-y-1.5">
            <div className="text-zinc-500">document.head 안의 실제 &lt;link rel=&quot;preload&quot;&gt; 조회 결과:</div>
            <div className={actual.preloadLink ? 'text-emerald-400' : 'text-zinc-500'}>
              {actual.preloadLink
                ? `<link rel="preload" as="image" href="${actual.preloadLinkHref ?? ''}" />`
                : '(현재 variant의 이미지에 해당하는 preload 링크 없음)'}
            </div>
            <div className="text-blue-300">
              실제 렌더된 &lt;img&gt; 속성 — {actual.imgSrc === null ? '측정 중…' : actual.loading ? `loading="${actual.loading}"` : 'loading 속성 없음(non-lazy)'}
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter variant={variant} expected={expected} actual={actual} isMatched={isMatched} />
    </>
  )
}
