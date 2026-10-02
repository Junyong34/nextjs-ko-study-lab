'use client'

import React from 'react'
import Image from 'next/image'
import { DemoPlaygroundCard, DemoResetButton, ExpectedActualPanel } from '@study/demo-kit'
import { content } from '../content'
import { SAMPLE_PATH } from '../lib/constants'
import { buildChecks } from '../lib/verdict'
import { useConfigProbe } from '../hooks/useConfigProbe'
import type { ComputedImgProps } from '../types'
import { PatternQuiz } from './PatternQuiz'

interface Props {
  /** 서버 렌더 시 getImageProps()가 계산한 값 */
  computed: ComputedImgProps[]
  /** 설정 예제·확인 절차(서버 컴포넌트) */
  guide: React.ReactNode
}

export function RemotePatternsLab({ computed, guide }: Props) {
  const { imgRef, outcome, dom, run, isPending, measure, reset } = useConfigProbe()
  const checks = outcome ? buildChecks(outcome, dom, computed) : null

  return (
    <>
      <DemoPlaygroundCard title="현재 설정 실측과 remotePatterns 개념 확인 — 실제 파일: actions.ts, sample/route.ts, lib/remote-pattern.ts" className="min-w-0">
        <div className="min-w-0 space-y-6">
          <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            {content.notApplied}
          </p>

          <section className="min-w-0 space-y-3" aria-label="현재 설정 실측">
            <h3 className="text-sm font-semibold">현재 설정 실측 (images.unoptimized: true)</h3>
            <div className="grid min-w-0 gap-3 sm:grid-cols-[240px_1fr]">
              <Image
                key={run}
                ref={imgRef}
                src={SAMPLE_PATH}
                alt="sample/route.ts가 만든 640px SVG"
                width={640}
                height={320}
                className="h-auto w-full rounded border border-zinc-200 dark:border-zinc-800"
              />
              <div className="min-w-0 space-y-2 text-xs">
                <p>
                  왼쪽은 <code>{'<Image src="…/sample" width={640} height={320}>'}</code>입니다. [현재 설정 측정]은 Server Action이 이 zone의{' '}
                  <code>/_next/image?url=…&amp;w=640&amp;q=75</code>에 로컬·원격 URL로 요청한 응답과, 렌더된 <code>{'<img>'}</code>의 DOM 값을 읽습니다.
                </p>
                <ul className="space-y-1">
                  {computed.map((c) => (
                    <li key={c.label} className="break-all">
                      getImageProps({c.label}) → src <code>{c.src}</code> · srcSet {c.srcSet ?? '없음'}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={measure}
                    disabled={isPending}
                    className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    {isPending ? '측정 중...' : '현재 설정 측정'}
                  </button>
                  <DemoResetButton label="측정 초기화" onReset={reset} />
                </div>
              </div>
            </div>
          </section>

          {guide}
          <PatternQuiz />
        </div>
      </DemoPlaygroundCard>

      <div aria-live="polite">
        <ExpectedActualPanel
          title="unoptimized: true에서 /_next/image와 <img>의 실제 모습"
          className="min-w-0 break-words"
          expected={
            <ul className="space-y-1">
              <li>• /_next/image는 로컬·원격 URL 모두 404 (remotePatterns 검사의 400까지 가지 않음)</li>
              <li>• getImageProps()의 src는 입력 그대로, srcSet 없음</li>
              <li>• 렌더된 {'<img src>'}는 원본 경로, srcset 없음, 원본 640px</li>
            </ul>
          }
          actual={
            checks ? (
              <ul className="space-y-1.5">
                {checks.map((c) => (
                  <li key={c.label} className="break-all">
                    <span className="font-medium">{c.ok ? '일치' : '불일치'} · {c.label}</span>
                    <br />
                    {c.actual}
                  </li>
                ))}
                {outcome?.ok && <li className="text-zinc-500">요청 origin {outcome.origin} · {outcome.measuredAt}</li>}
              </ul>
            ) : (
              <span>[현재 설정 측정]을 누르면 서버가 받은 응답과 DOM 값을 표시합니다.</span>
            )
          }
          isMatched={checks ? checks.every((c) => c.ok) : undefined}
          description="측정값만으로 판정합니다. remotePatterns 적용 후의 400은 이 앱에서 나올 수 없어 판정에 넣지 않았고, 개념 확인은 문서 규칙 계산으로 따로 풉니다."
        />
      </div>
    </>
  )
}
