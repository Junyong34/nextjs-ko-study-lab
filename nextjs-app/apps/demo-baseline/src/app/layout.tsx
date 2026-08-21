import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Demo Baseline',
  description: 'Next.js Study Lab - Baseline Demo App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="m-0 p-0 bg-transparent font-sans antialiased text-zinc-900 dark:text-zinc-100">
        {children}
      </body>
    </html>
  )
}
