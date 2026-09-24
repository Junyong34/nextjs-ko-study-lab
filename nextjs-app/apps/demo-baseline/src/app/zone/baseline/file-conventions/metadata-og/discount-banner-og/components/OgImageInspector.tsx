'use client'
import { DemoResetButton } from '@study/demo-kit'
import { useOgInspection } from '../hooks/useOgInspection'
import { DISCOUNT_SLOT_SECONDS } from '../discount-data'
import { MetaTagTable } from './MetaTagTable'
import { ImageProbeCard } from './ImageProbeCard'
import { VerificationFooter } from './VerificationFooter'

export function OgImageInspector() {
  const { inspection, isRunning, run, reset } = useOgInspection()
  const { domMeta, htmlMeta, probes, error } = inspection

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="space-y-1">
            <button
              type="button"
              onClick={run}
              disabled={isRunning}
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              {isRunning ? '실측 중...' : 'HTML <head> 파싱 + 이미지 2회 요청'}
            </button>
            <p className="text-zinc-500">
              할인율은 {DISCOUNT_SLOT_SECONDS}초마다 바뀝니다. 잠시 뒤 다시 누르면 요청 시 생성 이미지만 새 할인율을 반영합니다.
            </p>
          </div>
          <DemoResetButton onReset={reset} />
        </div>

        {error && <p className="rounded border border-rose-300 p-2 text-xs text-rose-600">{error}</p>}

        <div className="grid gap-3 lg:grid-cols-2">
          <MetaTagTable
            title="현재 문서 DOM의 이미지 meta 태그"
            rows={domMeta}
            emptyText="DOM에서 og:image / twitter:image 태그를 찾지 못했습니다."
          />
          <MetaTagTable
            title="서버가 보낸 HTML 원문의 이미지 meta 태그"
            rows={htmlMeta}
            emptyText="버튼을 누르면 이 페이지 HTML을 다시 받아 파싱합니다."
          />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <ImageProbeCard title="og:image — 요청 시 생성" file="opengraph-image.tsx (connection())" probe={probes.og} />
          <ImageProbeCard title="twitter:image — 정적 생성" file="twitter-image.tsx (Request-time API 없음)" probe={probes.twitter} />
        </div>
      </div>

      <VerificationFooter htmlMeta={htmlMeta} probes={probes} hasRun={htmlMeta.length > 0 || error !== null} />
    </div>
  )
}
