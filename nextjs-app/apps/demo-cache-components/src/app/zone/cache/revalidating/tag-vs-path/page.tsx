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
                    "step": 1,
                    "title": "[1. A 상품만 무효화 revalidateTag('product-a')] 클릭",
                    "description": "product-a 태그가 부여된 A 상품 캐시만 선택적으로 무효화합니다.",
                    "actionBadge": "태그 A 무효화"
          },
          {
                    "step": 2,
                    "title": "[2. B 상품만 무효화 revalidateTag('product-b')] 클릭",
                    "description": "product-b 태그가 부여된 B 상품 캐시만 독립적으로 무효화합니다.",
                    "actionBadge": "태그 B 무효화"
          },
          {
                    "step": 3,
                    "title": "[3. 경로 전체 일괄 무효화 revalidatePath()] 클릭",
                    "description": "경로 하위의 모든 데이터 캐시를 일괄 무효화합니다.",
                    "actionBadge": "경로 일괄 무효화"
          },
          {
                    "step": 4,
                    "title": "캐시 무효화 범위 및 HIT/MISS 상태 관찰",
                    "description": "태그 무효화와 경로 무효화의 영향 범위를 대조 관찰합니다.",
                    "actionBadge": "결과 관찰",
                    "observe": "revalidateTag 호출 시 지정 태그의 캐시만 MISS로 전환되고 다른 태그는 HIT 유지됨",
                    "observeAt": "playground"
          }
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
