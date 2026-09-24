'use client'

import { useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { resetRenderSnapshot } from './actions'
import { CatalogGrid } from './components/CatalogGrid'
import { CostTable } from './components/CostTable'
import { VerificationFooter } from './components/VerificationFooter'
import { useCatalogActivity } from './hooks/useCatalogActivity'
import { usePrefetchNetwork } from './hooks/usePrefetchNetwork'
import { useRenderSnapshot } from './hooks/useRenderSnapshot'
import type { PrefetchMode } from './types'

const IS_DEV = process.env.NODE_ENV !== 'production'

export default function DemoPage() {
  const [mode, setMode] = useState<PrefetchMode>('auto')
  const network = usePrefetchNetwork()
  const { activity, registerLink, markHover } = useCatalogActivity()
  const { snapshot: renders } = useRenderSnapshot()

  const handleReset = async () => {
    await resetRenderSnapshot()
    // Client Cache·Resource Timing 버퍼까지 비우려면 문서를 새로 불러와야 한다.
    window.location.reload()
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="대규모 카탈로그 prefetch 최적화"
        concept="링크가 수십 개인 화면에서 기본 <Link>는 보이는 링크마다 prefetch 요청을 보냅니다. 같은 96개 카탈로그를 네 가지 전략으로 스크롤해 보고, 브라우저가 실제로 보낸 요청 수·전송량과 서버 렌더 횟수를 나란히 비교합니다."
        steps={[
          {
            step: 1,
            title: '전략 하나를 고르고 카탈로그를 끝까지 스크롤',
            description:
              '처음 선택된 [기본값]에서 박스 안을 스크롤하거나 "한 화면 아래로 스크롤"을 반복합니다. 링크가 보일 때마다 요청 수가 오르는지 확인합니다.',
            actionBadge: '스크롤',
          },
          {
            step: 2,
            title: '[전체 prefetch]·[hover 기반]·[비활성화]에서 같은 동작 반복',
            description:
              '모드를 바꾸면 목적지 URL이 달라져 이전 모드의 Client Cache와 섞이지 않습니다. hover 기반에서는 상품 몇 개에 마우스를 올려 봅니다.',
            actionBadge: '전략 비교',
            observe: '표의 "prefetch 요청"·"transferSize 합"·"서버 layout / page" 열',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '검증 패널에서 전략별 비용 대조',
            description:
              '측정은 production(next build → next start)에서만 의미가 있습니다. 개발 서버에서는 뷰포트 prefetch가 실행되지 않아 모두 0건입니다.',
            actionBadge: '실측 대조',
            observe: '기대 결과와 실제 측정값, 현재 실행 모드',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="상품 카탈로그 96개 링크 — components/CatalogGrid.tsx → item/[mode]/[sku]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span
              className={`rounded px-2 py-0.5 font-mono font-bold ${
                IS_DEV
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {IS_DEV ? 'development — 뷰포트 prefetch 꺼짐' : 'production — 뷰포트 prefetch 동작'}
            </span>
            <DemoResetButton onReset={handleReset} label="측정 초기화 (서버 카운터 + 새로고침)" />
          </div>
          <CatalogGrid mode={mode} onModeChange={setMode} registerLink={registerLink} onHover={markHover} />
          <CostTable mode={mode} network={network} activity={activity} renders={renders} />
          <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            요청 수·바이트는 <code>PerformanceObserver(&apos;resource&apos;)</code>가 이 페이지 마운트 이후 기록한{' '}
            <code>item/…?_rsc=</code> 요청만 합산한 값이고, 서버 layout / page는 목적지 파일이 서버에서 실행될 때 올린
            메모리 카운터를 Server Action으로 2초마다 읽은 값입니다.
          </p>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter isDev={IS_DEV} network={network} activity={activity} renders={renders} />
    </DemoContainer>
  )
}
