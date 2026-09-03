import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/loading/skeleton-boundary/slow-catalog')

import React from 'react'
import Link from 'next/link'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from '../components/VerificationFooter'

export const dynamic = 'force-dynamic'

async function getDelayedCatalog() {
  // 실제 서버 지연 시뮬레이션 (1.2초)
  await new Promise((resolve) => setTimeout(resolve, 1200))
  return [
    {
      id: 'PROD-SKL-01',
      name: '하이드로 플로우 러닝화',
      category: '신발 / 러닝',
      price: 159000,
      stock: 18,
    },
    {
      id: 'PROD-SKL-02',
      name: '써멀 프로 플리스 자켓',
      category: '아우터 / 등산',
      price: 189000,
      stock: 5,
    },
    {
      id: 'PROD-SKL-03',
      name: '컴팩트 트레킹 폴',
      category: '장비 / 트레킹',
      price: 69000,
      stock: 30,
    },
  ]
}

export default async function SlowCatalogPage() {
  const startTime = Date.now()
  const products = await getDelayedCatalog()
  const elapsedMs = Date.now() - startTime
  const BASE_PATH = '/zone/baseline/file-conventions/loading/skeleton-boundary'

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="loading.tsx 스켈레톤 스트리밍 완료"
        concept="Next.js App Router의 loading.tsx는 React Suspense를 자동으로 감싸 서버 비동기 데이터 페칭 중 스켈레톤 UI를 즉시 렌더링하고, 페칭 완료 시 본 페이지로 스트리밍 교체합니다."
        steps={[
          {
            step: 1,
            title: "Suspense 바운더리 자동 생성",
            description: "loading.tsx 파일이 해당 세그먼트의 page.tsx를 <Suspense fallback={<Loading />}>로 래핑합니다.",
            actionBadge: "Suspense 자동화",
          },
          {
            step: 2,
            title: "지연 서버 페칭 (1.2s)",
            description: `서버 비동기 작업(${elapsedMs}ms 소요) 동안 클라이언트에 스켈레톤 애니메이션이 노출되었습니다.`,
            actionBadge: `${elapsedMs}ms 지연`,
          },
          {
            step: 3,
            title: "RSC 스트리밍 완료",
            description: "데이터 페칭이 완료된 후 본문 콘텐츠가 즉각적으로 교체 마운트되었습니다.",
            actionBadge: "스트리밍 완료",
          },
        ]}
      />

      <DemoPlaygroundCard title={`쇼핑몰 상품 카탈로그 (지연 응답: ${elapsedMs}ms)`}>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">서버 스트리밍 로드 완료</h4>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {elapsedMs}ms 페칭
                </span>
              </div>
              <p className="text-xs text-zinc-500">loading.tsx 스켈레톤이 해제되고 실제 서버 컴포넌트가 마운트되었습니다.</p>
            </div>
            <Link
              href={BASE_PATH}
              className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            >
              ← 데모 홈으로 복귀
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2"
              >
                <div>
                  <span className="font-mono text-[10px] text-zinc-400">{p.id}</span>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs mt-1">{p.name}</h5>
                  <p className="text-[11px] text-zinc-500">{p.category}</p>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-200 pt-2 dark:border-zinc-800">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    {p.price.toLocaleString()}원
                  </span>
                  <span className="text-[10px] text-zinc-400">{p.stock}개 재고</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DemoPlaygroundCard>

      <VerificationFooter elapsedMs={elapsedMs} isLoaded={true} />
    </DemoContainer>
  )
}
