import type { Metadata } from 'next'
import { siteUrl, locale, ogImageSize } from '@study/demos'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Baseline 데모 - Next.js 학습',
    default: 'Next.js 학습 데모 (Baseline Zone)',
  },
  description: 'Next.js App Router 표준 기능 및 아키텍처 실습 예제 (Baseline Zone)',
  openGraph: {
    type: 'website',
    locale,
    url: `${siteUrl}/zone/baseline`,
    siteName: 'Next.js 학습 데모',
    title: 'Next.js 학습 데모 (Baseline Zone)',
    description: 'Next.js App Router 표준 기능 및 아키텍처 실습 예제 (Baseline Zone)',
    images: [{ url: '/og-image.png', ...ogImageSize, alt: 'Next.js 학습 데모 (Baseline Zone)' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js 학습 데모 (Baseline Zone)',
    description: 'Next.js App Router 표준 기능 및 아키텍처 실습 예제 (Baseline Zone)',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="m-0 p-0 bg-transparent font-sans antialiased text-zinc-900 dark:text-zinc-100">
        {children}
      </body>
    </html>
  )
}
