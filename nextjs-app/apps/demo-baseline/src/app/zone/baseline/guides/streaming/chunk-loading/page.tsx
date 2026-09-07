import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/streaming/chunk-loading')
export const dynamic = 'force-dynamic'

import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { StreamController } from './components/StreamController'
import { Chunk1 } from './components/Chunk1'
import { Chunk2 } from './components/Chunk2'
import { ChunkSkeleton } from './components/ChunkSkeleton'

function formatKstRenderTime(date: Date) {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  const y = kst.getUTCFullYear()
  const m = pad(kst.getUTCMonth() + 1)
  const d = pad(kst.getUTCDate())
  const h = pad(kst.getUTCHours())
  const min = pad(kst.getUTCMinutes())
  const s = pad(kst.getUTCSeconds())
  return `${y}-${m}-${d} ${h}:${min}:${s} KST`
}

export default function DemoPage() {
  const renderedAt = formatKstRenderTime(new Date())
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"점진적 HTML 청크 스트리밍 및 Suspense 경계"}
        concept={"서버에서 느린 백엔드 API 대기 중에도 빠른 정적 셸을 먼저 브라우저로 전송하고, 준비된 HTML 청크를 Suspense 경계 단위로 순차 스트리밍 교체합니다."}
        steps={[
          {
            step: 1,
            title: "초기 빠른 셸 청크(헤더/내비게이션) 수신 확인",
            description: "서버 통신 지연 없이 브라우저에 첫 번째 HTML 청크가 렌더링되는 것을 확인합니다.",
            actionBadge: "초기 셸 수신",
          },
          {
            step: 2,
            title: "[스트리밍 다시 재생] 클릭으로 router.refresh() 실행",
            description: "클릭 시 서버에 새 RSC 요청이 실제로 발생합니다. Network 탭에서 요청이 추가되는 것을 확인합니다.",
            actionBadge: "RSC 재요청",
          },
          {
            step: 3,
            title: "300ms/800ms 실제 지연 후 청크 순차 교체 관찰",
            description: "비동기 데이터가 서버에서 완료되는 즉시 브라우저의 스켈레톤 영역이 실제 콘텐츠로 치환되는 과정을 확인합니다.",
            actionBadge: "스트리밍 완료",
            observe: "각 청크 카드에 표시되는 실측 ms가 설계된 지연(300ms/800ms)에 근접하는지, 재생마다 값이 새로 계산되는지 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Suspense 스트리밍과 로딩 청크 순차 처리 실습"}>
        <StreamController renderedAt={renderedAt}>
          <div className="flex items-center gap-2 rounded bg-white p-2.5 text-xs font-mono border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
            <span className="rounded bg-emerald-600 px-1.5 py-0.2 text-[10px] font-bold text-white">CHUNK #1</span>
            <span>초기 셸 (0ms)</span>
          </div>
          <Suspense fallback={<ChunkSkeleton label="1차 청크: 상품 기본 스펙 로딩 중..." />}>
            <Chunk1 />
          </Suspense>
          <Suspense fallback={<ChunkSkeleton label="2차 청크: 실시간 고객 리뷰 로딩 중..." />}>
            <Chunk2 />
          </Suspense>
        </StreamController>
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
