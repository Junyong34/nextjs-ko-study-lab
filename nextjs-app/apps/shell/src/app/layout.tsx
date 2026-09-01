import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Header, Footer, type TreeNode } from '@study/ui'
import { getAugmentedTree, getDemos, getManifest } from '@/lib/docs'
import { AppFrame } from '@/components/layout/AppFrame'
import { LearningProgressProvider } from '@/components/learning-progress/LearningProgressProvider'
import { LearningProgressTrigger } from '@/components/learning-progress/LearningProgressTrigger'
import { GithubStarProvider, GithubStarPrompt } from '@/components/github-star'
import { createLearningInventory } from '@/lib/learning-progress/inventory'
import type { LearningInventory } from '@/lib/learning-progress/types'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Next.js 학습',
    default: 'Next.js 학습 (App Router)',
  },
  description:
    'Next.js 공식 문서를 체계적인 한국어 학습 커리큘럼으로 재구성하고 인터랙티브 데모로 검증하는 실습 랩',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let tree: TreeNode[] = []
  let inventory: LearningInventory = { documents: [], demos: [] }
  try {
    tree = getAugmentedTree()
    inventory = createLearningInventory(getManifest(), getDemos())
  } catch (err) {
    console.error('Failed to load shell inventory:', err)
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <LearningProgressProvider inventory={inventory}>
          <GithubStarProvider>
            <Header />
            <AppFrame tree={tree}>{children}</AppFrame>
            <Footer />
            <LearningProgressTrigger />
            <GithubStarPrompt />
          </GithubStarProvider>
        </LearningProgressProvider>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  )
}
