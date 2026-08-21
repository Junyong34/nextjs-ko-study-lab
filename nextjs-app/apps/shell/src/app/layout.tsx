import type { Metadata } from 'next'
import { Header, DocTree, Footer, type TreeNode } from '@study/ui'
import { getAugmentedTree } from '@/lib/docs'
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
  try {
    tree = getAugmentedTree()
  } catch (err) {
    console.error('Failed to load tree:', err)
  }

  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <Header />
        <div className="mx-auto flex w-full max-w-[90rem] flex-1 items-start px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <DocTree tree={tree} />
          <main className="flex-1 min-w-0 lg:pl-8 lg:pr-4 pb-16">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
