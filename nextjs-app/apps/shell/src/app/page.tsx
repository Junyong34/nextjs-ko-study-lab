import React from 'react'
import type { Metadata } from 'next'
import { getManifest, getDemos } from '@/lib/docs'
import { buildPageMetadata } from '@/lib/seo/metadata'
import {
  RoadmapHero,
  RoadmapBookshelf,
  // Next16HighlightsSection,
  FeaturedDemosSection,
  LearningProgressWidget,
} from '@/components/home'

export const metadata: Metadata = buildPageMetadata({
  title: 'Next.js 16 학습 | App Router 한국어 가이드 & 실습 예제',
  description:
    'Next.js 공식 문서를 바탕으로 App Router 핵심 개념을 한국어로 배우고, 실습 예제로 기능의 동작을 직접 확인해 보세요.',
  path: '/',
})

export default function HomePage() {
  const manifest = getManifest()
  const allDemos = getDemos()

  const totalDocs = manifest.totalDocs || 0
  const totalDemos = allDemos.length || 0

  return (
    <div className="w-full space-y-16 sm:space-y-20 pb-12">
      {/* 1. Hero Section */}
      <RoadmapHero totalDocs={totalDocs} totalDemos={totalDemos} />

      {/* 2. Next.js 16 & React 19 Key Highlights (컨텐츠 개발 후 재연결 예정) */}
      {/* <Next16HighlightsSection /> */}

      {/* 3. 3D Book Bento Grid Curriculum Showcase */}
      <RoadmapBookshelf demos={allDemos} />

      {/* 4. Interactive Live Demos Showcase */}
      <FeaturedDemosSection totalDemos={totalDemos} />

      {/* 5. Learning Progress Dashboard Widget */}
      <LearningProgressWidget />
    </div>
  )
}

