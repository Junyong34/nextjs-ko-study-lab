import React from 'react'
import { cacheTag } from 'next/cache'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TagVsPathClient } from './components/TagVsPathClient'
import { VerificationFooter } from './components/VerificationFooter'

// 1. 배너 캐시 블록
async function getBannerData() {
  'use cache'
  cacheTag('tag-vs-path:banner')

  const now = new Date()
  return {
    title: ' 8월 전 품목 시즌오프 프로모션 진행 중!',
    timestamp: now.toLocaleTimeString('ko-KR'),
    cacheId: Math.random().toString(36).substring(2, 7).toUpperCase(),
  }
}

// 2. A 상품 캐시 블록
async function getProductA() {
  'use cache'
  cacheTag('tag-vs-path:product-a')

  const now = new Date()
  return {
    name: '에어 줌 프로 러닝화',
    price: 159000,
    timestamp: now.toLocaleTimeString('ko-KR'),
    cacheId: Math.random().toString(36).substring(2, 7).toUpperCase(),
  }
}

// 3. B 상품 캐시 블록
async function getProductB() {
  'use cache'
  cacheTag('tag-vs-path:product-b')

  const now = new Date()
  return {
    name: '오버핏 기모 맨투맨',
    price: 49000,
    timestamp: now.toLocaleTimeString('ko-KR'),
    cacheId: Math.random().toString(36).substring(2, 7).toUpperCase(),
  }
}

export default async function TagVsPathDemoPage() {
  const banner = await getBannerData()
  const productA = await getProductA()
  const productB = await getProductB()

  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="revalidateTag 정밀 태그 무효화 vs revalidatePath 경로 전체 무효화"
        concept="revalidateTag('product-a')는 해당 태그가 부여된 특정 캐시 항목만 정밀하게 무효화하지만, revalidatePath는 해당 라우트 경로 아래의 모든 캐시 엔트리를 한 번에 일괄 무효화합니다."
        steps={[
          {
            step: 1,
            title: "[1. A 상품만 무효화 revalidateTag('product-a')] 클릭",
            description: "정밀 무효화 버튼을 클릭하여 'A 상품' 캐시만 새 시각으로 갱신되고 B 상품 캐시는 유지되는 것을 확인합니다.",
            actionBadge: '정밀 태그 무효화',
          },
          {
            step: 2,
            title: '[3. 경로 전체 일괄 무효화 revalidatePath()] 클릭',
            description: '경로 무효화 버튼을 클릭하여 라우트에 속한 A 상품, B 상품 2개 항목이 모두 일괄 갱신되는 것을 확인합니다.',
            actionBadge: '경로 일괄 무효화',
          },
          {
            step: 3,
            title: '무효화 범위 및 캐시 로그 대조',
            description: '태그 기반 선별 갱신과 경로 기반 전체 갱신의 영향 범위 및 타임스탬프 차이를 대조 관찰합니다.',
            actionBadge: '무효화 범위 대조',
            observe: 'revalidateTag는 상품 A 캐시만 갱신하나, revalidatePath는 상품 A, B 캐시 전체를 일괄 갱신함',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="다중 캐시 블록 모니터 및 무효화 제어" className="space-y-4">
        {/* 온디맨드 무효화 컨트롤러 */}
        <TagVsPathClient />

        {/* 1) 공지 배너 캐시 카드 */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
            {banner.title}
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-zinc-400">생성: {banner.timestamp}</span>
            <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              배너 캐시 #{banner.cacheId}
            </span>
          </div>
        </div>

        {/* 2) A & B 상품 캐시 2단 그리드 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          {/* A 상품 */}
          <div className="rounded border border-blue-200 bg-blue-50/40 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 dark:text-blue-200">
                A 상품: {productA.name}
              </span>
              <span className="rounded bg-blue-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                #{productA.cacheId}
              </span>
            </div>
            <div className="font-mono text-zinc-700 dark:text-zinc-300">
              가격: {productA.price.toLocaleString()}원
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              태그: cacheTag('tag-vs-path:product-a') | 시각: {productA.timestamp}
            </div>
          </div>

          {/* B 상품 */}
          <div className="rounded border border-emerald-200 bg-emerald-50/40 p-3.5 dark:border-emerald-900/50 dark:bg-emerald-950/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 dark:text-emerald-200">
                B 상품: {productB.name}
              </span>
              <span className="rounded bg-emerald-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                #{productB.cacheId}
              </span>
            </div>
            <div className="font-mono text-zinc-700 dark:text-zinc-300">
              가격: {productB.price.toLocaleString()}원
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              태그: cacheTag('tag-vs-path:product-b') | 시각: {productB.timestamp}
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
