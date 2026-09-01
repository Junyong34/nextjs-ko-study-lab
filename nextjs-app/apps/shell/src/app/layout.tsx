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
import { JsonLd } from '@/components/seo/JsonLd'
import { buildWebsiteJsonLd } from '@/lib/seo/json-ld'
import { siteConfig } from '@/lib/seo/config'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: siteConfig.titleTemplate,
    default: siteConfig.name,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
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
        <JsonLd data={buildWebsiteJsonLd()} />
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
