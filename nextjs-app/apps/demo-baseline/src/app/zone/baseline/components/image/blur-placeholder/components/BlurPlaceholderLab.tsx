'use client'

import React, { useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import sceneImage from '../assets/mountain-sunset.png'
import type { CaseExpectation, CaseId } from '../types'
import { PlaceholderCaseCard } from './PlaceholderCaseCard'
import { usePlaceholderProbe } from './usePlaceholderProbe'
import { VerificationFooter } from './VerificationFooter'

const SLOW_PHOTO_PATH = '/zone/baseline/components/image/blur-placeholder/slow-photo'
const DELAYS = [0, 1500, 3000] as const
const DEFAULT_DELAY = 1500

// 하이드레이션이 끝난 뒤에만 <Image>를 마운트해, "마운트 → onLoad" 측정이
// 서버 HTML이 먼저 내려받은 이미지와 섞이지 않게 한다.
const subscribeNoop = () => () => {}
const useHydrated = () => useSyncExternalStore(subscribeNoop, () => true, () => false)

export function BlurPlaceholderLab({ manualBlurDataURL }: { manualBlurDataURL: string }) {
  const hydrated = useHydrated()
  const [delay, setDelay] = useState<number>(DEFAULT_DELAY)
  const [runKey, setRunKey] = useState(0)

  // 하이드레이션 직후(-1 → runKey)에도 측정을 다시 시작해야 하므로 두 값을 합친 키를 쓴다.
  const probeKey = hydrated ? runKey : -1
  const staticProbe = usePlaceholderProbe(probeKey)
  const remoteBlurProbe = usePlaceholderProbe(probeKey)
  const remoteEmptyProbe = usePlaceholderProbe(probeKey)

  // 같은 URL은 브라우저 메모리 캐시가 재사용하므로 run 값을 붙여 매번 진짜 요청을 만든다.
  const remoteSrc = (id: CaseId) => `${SLOW_PHOTO_PATH}?delay=${delay}&case=${id}&run=${runKey}`

  const expectations: Record<CaseId, CaseExpectation> = {
    'static-blur': {
      bgInitially: true,
      source: 'import 객체의 자동 생성 값',
      expectedHref: sceneImage.blurDataURL ?? null,
    },
    'remote-blur': { bgInitially: true, source: '직접 넘긴 prop 값', expectedHref: manualBlurDataURL },
    'remote-empty': { bgInitially: false, source: '없음', expectedHref: null },
  }

  const rerun = (nextDelay = delay) => {
    setDelay(nextDelay)
    setRunKey((k) => k + 1)
  }

  const imgClass = 'block h-auto w-full'

  return (
    <>
      <DemoPlaygroundCard title="풍경 사진 갤러리 — 실제 파일: components/BlurPlaceholderLab.tsx, slow-photo/route.ts">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-zinc-500">서버 응답 지연</span>
              {DELAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => rerun(d)}
                  className={`cursor-pointer rounded px-2.5 py-1 font-semibold transition ${
                    delay === d
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {d} ms
                </button>
              ))}
              <button
                type="button"
                onClick={() => rerun()}
                className="cursor-pointer rounded bg-zinc-900 px-2.5 py-1 font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                이미지 다시 요청
              </button>
            </div>
            <DemoResetButton onReset={() => rerun(DEFAULT_DELAY)} label="초기화" />
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-500">
            오른쪽 두 사진은 <code>slow-photo/route.ts</code>가 서버에서 실제로 {delay} ms를 기다린 뒤 PNG를 보냅니다.
            브라우저는 그동안 진짜로 응답을 기다리며, 아래 수치는 모두 렌더된 &lt;img&gt;의 style과
            performance API에서 읽은 값입니다. 정적 import 사진은 빌드 산출물(_next/static)이라 지연이 걸리지 않습니다.
          </p>

          {hydrated ? (
            <div className="grid gap-3 md:grid-cols-3">
              <PlaceholderCaseCard
                title="A. 정적 import + blur"
                code={`import img from './assets/mountain-sunset.png'  <Image src={img} placeholder="blur" />`}
                expectation={expectations['static-blur']}
                result={staticProbe.result}
              >
                <Image
                  key={`a-${runKey}`}
                  ref={staticProbe.imgRef}
                  onLoad={staticProbe.onLoad}
                  src={sceneImage}
                  alt="노을 진 산 풍경(정적 import)"
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={imgClass}
                />
              </PlaceholderCaseCard>
              <PlaceholderCaseCard
                title="B. 동적 URL + blur + blurDataURL"
                code={`<Image src="/…/slow-photo?delay=${delay}" placeholder="blur" blurDataURL="data:image/png;base64,…" />`}
                expectation={expectations['remote-blur']}
                result={remoteBlurProbe.result}
              >
                <Image
                  key={`b-${runKey}-${delay}`}
                  ref={remoteBlurProbe.imgRef}
                  onLoad={remoteBlurProbe.onLoad}
                  src={remoteSrc('remote-blur')}
                  alt="노을 진 산 풍경(지연 응답, blur)"
                  width={1200}
                  height={500}
                  placeholder="blur"
                  blurDataURL={manualBlurDataURL}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={imgClass}
                />
              </PlaceholderCaseCard>
              <PlaceholderCaseCard
                title="C. 동적 URL + empty(기본값)"
                code={`<Image src="/…/slow-photo?delay=${delay}" placeholder="empty" />`}
                expectation={expectations['remote-empty']}
                result={remoteEmptyProbe.result}
              >
                <Image
                  key={`c-${runKey}-${delay}`}
                  ref={remoteEmptyProbe.imgRef}
                  onLoad={remoteEmptyProbe.onLoad}
                  src={remoteSrc('remote-empty')}
                  alt="노을 진 산 풍경(지연 응답, empty)"
                  width={1200}
                  height={500}
                  placeholder="empty"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={imgClass}
                />
              </PlaceholderCaseCard>
            </div>
          ) : (
            <p className="text-xs text-zinc-500">하이드레이션 대기 중…</p>
          )}
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter
        delay={delay}
        expectations={expectations}
        results={{
          'static-blur': staticProbe.result,
          'remote-blur': remoteBlurProbe.result,
          'remote-empty': remoteEmptyProbe.result,
        }}
        staticMeta={{
          blurWidth: sceneImage.blurWidth ?? null,
          blurHeight: sceneImage.blurHeight ?? null,
          blurDataURLLength: sceneImage.blurDataURL?.length ?? 0,
          manualLength: manualBlurDataURL.length,
        }}
      />
    </>
  )
}
