import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'revalidating/tag-vs-path')

import React from 'react'
import { cacheTag } from 'next/cache'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { TagVsPathClient } from './components/TagVsPathClient'

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
        title="updateTag 정밀 태그 무효화 vs revalidatePath 경로 전체 무효화"
        concept="updateTag('product-a')는 해당 태그가 부여된 특정 캐시 항목만 정밀하게, 그리고 즉시(read-your-own-writes) 무효화하지만, revalidatePath는 해당 라우트 경로 아래의 모든 캐시 엔트리를 한 번에 일괄 무효화합니다. (참고: revalidateTag(tag, 'max')는 즉시 반영이 아니라 다음 방문 시점에 백그라운드로 갱신되는 stale-while-revalidate 방식이라, Server Action에서 클릭 즉시 반영이 필요할 땐 updateTag가 공식 권장값입니다.)"
        steps={[
          {
            step: 1,
            title: "[1. A 상품만 무효화 updateTag('product-a')] 클릭",
            description: "product-a 태그가 부여된 A 상품 캐시만 선택적으로, 즉시 무효화합니다.",
            actionBadge: "태그 A 무효화",
          },
          {
            step: 2,
            title: "[2. B 상품만 무효화 updateTag('product-b')] 클릭",
            description: "product-b 태그가 부여된 B 상품 캐시만 독립적으로, 즉시 무효화합니다.",
            actionBadge: "태그 B 무효화",
          },
          {
            step: 3,
            title: "[3. 경로 전체 일괄 무효화 revalidatePath()] 클릭",
            description: "경로 하위의 모든 데이터 캐시를 일괄 무효화합니다.",
            actionBadge: "경로 일괄 무효화",
          },
          {
            step: 4,
            title: "캐시 무효화 범위 및 HIT/MISS 상태 관찰",
            description: "태그 무효화와 경로 무효화의 영향 범위를 대조 관찰합니다.",
            actionBadge: "결과 관찰",
            observe: "updateTag 호출 시 지정 태그의 캐시만 즉시 MISS로 전환되어 새 ID로 바뀌고 다른 태그는 HIT 유지됨",
            observeAt: "playground",
          },
        ]}
      />

      {/* 2단, 3단, 4단: 실습 조작 영역 및 검증/개념정리 */}
      <TagVsPathClient banner={banner} productA={productA} productB={productB} />
    </DemoContainer>
  )
}
