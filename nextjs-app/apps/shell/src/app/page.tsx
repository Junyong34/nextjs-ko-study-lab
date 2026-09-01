import React from 'react'
import type { Metadata } from 'next'
import { getManifest, getDemos } from '@/lib/docs'
import {
  RoadmapHero,
  RoadmapBookshelf,
  // Next16HighlightsSection,
  FeaturedDemosSection,
  LearningProgressWidget,
} from '@/components/home'

export const metadata: Metadata = {
  title: 'Next.js 16 학습 로드맵 | App Router 한국어 가이드 & 실습 랩',
  description:
    'Next.js 16 공식 문서를 체계적인 한국어 커리큘럼으로 학습하고 인터랙티브 실습 데모로 직접 검증하는 학습 플랫폼',
}

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


