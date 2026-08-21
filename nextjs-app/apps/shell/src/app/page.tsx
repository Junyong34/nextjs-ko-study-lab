import React from 'react'
import type { Metadata } from 'next'
import { TableOfContents } from '@study/ui'
import { getManifest, getDemos } from '@/lib/docs'
import { RoadmapHero, RoadmapStepCards } from '@/components/home'

export const metadata: Metadata = {
  title: 'Next.js 16 학습 로드맵 | App Router 한국어 가이드 & 실습 랩',
  description:
    'Next.js 16 공식 문서를 체계적인 한국어 커리큘럼으로 학습하고 인터랙티브 실습 데모로 직접 검증하는 학습 플랫폼',
}

const HOME_HEADINGS = [
  { id: 'roadmap', text: '학습 로드맵', level: 2 },
  { id: 'step-01', text: 'Step 01. 시작하기', level: 3 },
  { id: 'step-02', text: 'Step 02. 실무 가이드', level: 3 },
  { id: 'step-03', text: 'Step 03. API 레퍼런스', level: 3 },
  { id: 'step-04', text: 'Step 04. 핵심 용어집', level: 3 },
  { id: 'step-05', text: 'Step 05. 아키텍처', level: 3 },
]

export default function HomePage() {
  const manifest = getManifest()
  const allDemos = getDemos()

  const totalDocs = manifest.totalDocs || 0
  const totalDemos = allDemos.length || 0

  return (
    <div className="flex items-start gap-8">
      {/* Main Roadmap Hub Content */}
      <div className="min-w-0 flex-1 space-y-8 pb-10">
        <RoadmapHero totalDocs={totalDocs} totalDemos={totalDemos} />
        <RoadmapStepCards />
      </div>

      {/* Right Sticky Table of Contents */}
      <TableOfContents headings={HOME_HEADINGS} />
    </div>
  )
}
