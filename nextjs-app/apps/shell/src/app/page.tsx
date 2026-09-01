import React from 'react'
import type { Metadata } from 'next'
import { TableOfContents } from '@study/ui'
import { getManifest, getDemos } from '@/lib/docs'
import { RoadmapHero, RoadmapBookshelf } from '@/components/home'

export const metadata: Metadata = {
  title: 'Next.js 16 학습 로드맵 | App Router 한국어 가이드 & 실습 랩',
  description:
    'Next.js 16 공식 문서를 체계적인 한국어 커리큘럼으로 학습하고 인터랙티브 실습 데모로 직접 검증하는 학습 플랫폼',
}

const HOME_HEADINGS = [
  { id: 'bookshelf', text: 'Nextjs 학습하기', level: 2 },
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
        <RoadmapBookshelf demos={allDemos} />
      </div>

      {/* Right Sticky Table of Contents */}
      <TableOfContents headings={HOME_HEADINGS} />
    </div>
  )
}

