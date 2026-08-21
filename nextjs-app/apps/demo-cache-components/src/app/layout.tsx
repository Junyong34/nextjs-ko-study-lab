import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Demo Cache Components',
  description: 'Next.js 16 Cache Components Demo Zone',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <body className="h-full bg-transparent font-sans text-zinc-900 antialiased dark:text-zinc-100">
        {children}
      </body>
    </html>
  )
}
