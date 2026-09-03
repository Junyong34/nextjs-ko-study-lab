import type { Metadata } from 'next'
import './globals.css'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-nextjs-lab.space').replace(/\/$/, '')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Cache Components 데모 - Next.js 학습',
    default: 'Next.js 16 Cache Components 데모',
  },
  description: 'Next.js 16 use cache 및 Cache Components 실습 예제 (Cache Zone)',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: `${siteUrl}/zone/cache`,
    siteName: 'Next.js 학습 데모',
    title: 'Next.js 16 Cache Components 데모',
    description: 'Next.js 16 use cache 및 Cache Components 실습 예제 (Cache Zone)',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Next.js 16 Cache Components 데모' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js 16 Cache Components 데모',
    description: 'Next.js 16 use cache 및 Cache Components 실습 예제 (Cache Zone)',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full bg-transparent font-sans text-zinc-900 antialiased dark:text-zinc-100">
        {children}
      </body>
    </html>
  )
}
