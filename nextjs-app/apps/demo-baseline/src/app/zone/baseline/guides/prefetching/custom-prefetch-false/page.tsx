'use client'

import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { LaneBoard } from './components/LaneBoard'
import { MeasurementTable } from './components/MeasurementTable'
import { VerificationFooter } from './components/VerificationFooter'
import { useRscEntries } from './hooks/useRscEntries'
import { resetServerCounts, useServerCounts } from './hooks/useServerCounts'
import { useMeasurements } from './lib/navTiming'
import { summarizeLanes, toRows } from './lib/summarize'
import { LAYOUT_COST_MS, PAGE_COST_MS } from './types'

export default function DemoPage() {
  const isDev = process.env.NODE_ENV !== 'production'
  const entries = useRscEntries()
  const measurements = useMeasurements()
  const counts = useServerCounts()
  const summary = summarizeLanes(entries, measurements, counts)
  const rows = toRows(entries, measurements)

  const handleReset = async () => {
    await resetServerCounts()
    window.location.reload()
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="prefetch={false}로 비싼 목적지의 prefetch 끄기와 클릭 비용"
        concept={`링크가 많고 목적지가 비쌀수록 뷰포트 prefetch는 서버 작업과 트래픽을 링크 수만큼 늘립니다. prefetch={false}는 그 비용을 0으로 만들지만, 대신 클릭한 순간에 목적지 layout(${LAYOUT_COST_MS}ms)을 기다리게 됩니다. hover 시에만 prefetch하는 커스텀 링크가 그 중간 해법입니다.`}
        steps={[
          {
            step: 1,
            title: '[예제 초기화] 후 레인별 "클릭 전 RSC 요청"과 서버 layout 렌더 수 확인',
            description: '아무 것도 누르지 않은 상태에서 A(기본)만 링크 수만큼 요청·서버 렌더가 올라가고 B·C·D는 0인지 봅니다.',
            actionBadge: '초기 비용 확인',
            observe: '레인 A와 B의 클릭 전 요청 수·서버 layout 렌더 수 차이',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: 'B 링크를 hover 없이 바로 클릭 → 돌아오기, 이어서 C·D 링크에 1초 hover 후 클릭 → 돌아오기',
            description: '목적지 화면 하단에 클릭→스켈레톤/본문 소요 ms가 표시됩니다. 돌아오면 아래 표에 누적됩니다.',
            actionBadge: '클릭 비용 측정',
          },
          {
            step: 3,
            title: '클릭→스켈레톤 시간을 레인별로 대조',
            description: `B는 클릭 후에야 layout을 요청하므로 스켈레톤까지 약 ${LAYOUT_COST_MS}ms 이상, 미리 받아둔 A·C는 거의 즉시입니다. 본문(${PAGE_COST_MS}ms)은 모두 클릭 후 요청합니다.`,
            actionBadge: '결과 대조',
            observe: '3단 검증 패널의 레인별 클릭→스켈레톤 ms',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="상품 목록 링크 12개 — 실제 파일: components/LaneBoard.tsx, dest/[id]/*">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`rounded px-2 py-0.5 font-mono text-[11px] font-bold ${
                isDev
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {isDev ? 'development — 자동 prefetch 비활성(사양)' : 'production — 자동 prefetch 활성'}
            </span>
            <DemoResetButton onReset={handleReset} label="예제 초기화 (서버 카운터 + 새로고침)" />
          </div>
          <LaneBoard summary={summary} />
          <MeasurementTable rows={rows} />
          <p className="text-[10px] text-zinc-500">
            요청 수는 <code>PerformanceObserver(&apos;resource&apos;)</code>가 기록한 <code>?_rsc=</code> 요청, 서버 렌더 수는{' '}
            <code>stats/route.ts</code>가 돌려주는 목적지 layout/page 실행 횟수입니다. 모두 실제 측정값입니다.
          </p>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter isDev={isDev} summary={summary} rows={rows} />
    </DemoContainer>
  )
}
