'use client'

import React from 'react'
import Image from 'next/image'
import { DemoPlaygroundCard, DemoResetButton, ExpectedActualPanel } from '@study/demo-kit'
import { content } from '../content'
import { FORMAT_CONFIGS, PRODUCT_SRC } from '../lib/constants'
import { negotiate } from '../lib/negotiate'
import { buildChecks } from '../lib/verdict'
import { useFormatProbe } from '../hooks/useFormatProbe'
import type { ComputedImgProps } from '../types'
import { FormatQuiz } from './FormatQuiz'

interface Props {
  /** 서버 렌더 시 getImageProps()가 계산한 값 */
  computed: ComputedImgProps
  /** 설정 예제·확인 절차(서버 컴포넌트) */
  guide: React.ReactNode
}

const ok = (b: boolean) => (b ? '성공' : '실패')

export function FormatsLab({ computed, guide }: Props) {
  const { imgRef, measurement: m, error, run, isPending, measure, reset } = useFormatProbe()
  const checks = m ? buildChecks(m, computed) : null
  const imgAccept = m?.accept.imgAccept ?? null

  return (
    <>
      <DemoPlaygroundCard title="브라우저 Accept 실측과 formats 협상 — 실제 파일: accept/route.ts, actions.ts, lib/negotiate.ts" className="min-w-0">
        <div className="min-w-0 space-y-6">
          <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            {content.notApplied}
          </p>

          <section className="min-w-0 space-y-3" aria-label="브라우저와 현재 설정 실측">
            <h3 className="text-sm font-semibold">브라우저와 현재 설정 실측</h3>
            <Image key={run} ref={imgRef} src={PRODUCT_SRC} alt="accept/route.ts가 만든 SVG" width={320} height={40} className="h-auto max-w-full rounded" />
            <p className="text-xs leading-relaxed">
              [브라우저·서버 측정]은 화면 밖 <code>{'<img>'}</code>로 accept/route.ts를 요청해 이미지 요청의 Accept를 받고, 같은 핸들러를 fetch()로 불러 비교합니다.
              작은 AVIF·WebP 샘플을 <code>createImageBitmap</code>으로 디코드하고 <code>canvas.toDataURL</code>로 인코드해 보며, Server Action이 그 Accept를 실어 이 zone의 <code>/_next/image</code>를 요청합니다.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={measure}
                disabled={isPending}
                className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {isPending ? '측정 중...' : '브라우저·서버 측정'}
              </button>
              <DemoResetButton label="측정 초기화" onReset={reset} />
            </div>
            {m && (
              <div className="min-w-0 space-y-2 rounded border border-zinc-200 p-3 text-xs dark:border-zinc-800">
                <p>디코드(createImageBitmap): AVIF {ok(m.support.decode.avif)} · WebP {ok(m.support.decode.webp)} / 인코드(canvas.toDataURL): AVIF {ok(m.support.encode.avif)} · WebP {ok(m.support.encode.webp)}</p>
                <p className="text-zinc-500">인코드 결과는 브라우저 canvas 능력이며 Accept와 무관합니다. 이미지를 받을 수 있는지는 디코드가 정합니다.</p>
                <p className="font-medium">이 브라우저의 Accept로 계산한 optimizer 응답 포맷 (적용했다면, 계산값)</p>
                <ul className="space-y-0.5">
                  {FORMAT_CONFIGS.map((c) => (
                    <li key={c.label} className="break-all font-mono">
                      formats: {c.label} → {imgAccept ? negotiate(c.formats, imgAccept) ?? '원본 포맷 유지' : 'Accept 없음'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {error && <p className="text-xs text-rose-700 dark:text-rose-400">측정 실패: {error}</p>}
          </section>

          {guide}
          <FormatQuiz />
        </div>
      </DemoPlaygroundCard>

      <div aria-live="polite">
        <ExpectedActualPanel
          title="이미지 Accept와 꺼진 optimizer의 실제 응답"
          className="min-w-0 break-words"
          expected={
            <ul className="space-y-1">
              <li>• {'<img>'} 요청 Accept의 image/avif·image/webp 여부 = 실제 디코드 성공 여부</li>
              <li>• fetch() 요청의 Accept는 */* (이미지 협상 신호가 없음)</li>
              <li>• /_next/image는 같은 Accept로도 404, AVIF·WebP Content-Type과 Vary: Accept 없음</li>
              <li>• getImageProps()·DOM의 src는 원본 경로, srcset 없음</li>
            </ul>
          }
          actual={
            checks ? (
              <ul className="space-y-1.5">
                {checks.map((c) => (
                  <li key={c.label} className="whitespace-pre-line break-all">
                    <span className="font-medium">{c.ok ? '일치' : '불일치'} · {c.label}</span>
                    <br />
                    {c.actual}
                  </li>
                ))}
                <li className="text-zinc-500">{m?.measuredAt}</li>
              </ul>
            ) : (
              <span>{error ? `측정 실패: ${error}` : '[브라우저·서버 측정]을 누르면 측정값을 표시합니다.'}</span>
            )
          }
          isMatched={checks ? checks.every((c) => c.ok) : error ? false : undefined}
          description="측정값만으로 판정합니다. AVIF·WebP 변환 결과(Content-Type, 크기, 인코딩 시간)는 optimizer가 꺼진 이 앱에서 나올 수 없어 판정에 넣지 않았습니다."
        />
      </div>
    </>
  )
}
