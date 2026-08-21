import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, Layers, CheckCircle2, Clock } from 'lucide-react'
import { getDemos, getDemoByUrl, getManifest } from '@/lib/docs'
import { DemoViewer } from '@/components/DemoViewer'

interface DemoPageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateStaticParams() {
  const demos = getDemos()
  return demos.map((demo) => ({
    slug: demo.url.split('/'),
  }))
}

export async function generateMetadata({ params }: DemoPageProps): Promise<Metadata> {
  const { slug } = await params
  const demoUrl = slug.join('/')
  const demo = getDemoByUrl(demoUrl)

  if (!demo) {
    return {
      title: '데모를 찾을 수 없습니다',
    }
  }

  return {
    title: `${demo.title} - 인터랙티브 데모`,
    description: `${demo.title} 실습 데모 - Next.js App Router 학습`,
  }
}

export default async function DemoStandalonePage({ params }: DemoPageProps) {
  const { slug } = await params
  const demoUrl = slug.join('/')
  const demo = getDemoByUrl(demoUrl)

  if (!demo) {
    notFound()
  }

  const manifest = getManifest()
  const matchedDoc = manifest.docs.find(
    (d) => d.path === demo.doc || d.path.endsWith(demo.doc)
  )
  const docUrl = matchedDoc ? matchedDoc.url : '/'
  const docTitle = matchedDoc ? matchedDoc.title : demo.doc

  const iframeSrc = `/zone/${demo.zone}/${demo.url}`
  const isDone = demo.status === 'done'

  return (
    <div className="space-y-6">
      {/* Top Chrome: Back Link & Breadcrumbs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/demo"
            className="inline-flex items-center gap-1 font-medium text-zinc-500 hover:text-zinc-800 transition dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>전체 데모</span>
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <Link
            href={docUrl}
            className="inline-flex items-center gap-1 font-medium text-zinc-700 hover:text-zinc-950 transition dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>근거 문서: {docTitle}</span>
          </Link>
        </div>

        {/* Demo Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 rounded bg-[#14161a0f] px-2 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-white/10 dark:text-zinc-200">
                <Layers className="h-3 w-3" />
                zone: {demo.zone}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isDone
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                <span>{demo.status.toUpperCase()}</span>
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              {demo.title}
            </h1>
            <p className="mt-1 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              /zone/{demo.zone}/{demo.url}
            </p>
          </div>

          <Link
            href={docUrl}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-xs hover:bg-zinc-50 hover:text-zinc-900 transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <BookOpen className="h-3.5 w-3.5 text-zinc-500" />
            <span>근거 문서 보기</span>
          </Link>
        </div>
      </div>

      {/* Main Body: Demo Viewer with Chrome */}
      <div className="w-full">
        <DemoViewer src={iframeSrc} title={demo.title} />
      </div>
    </div>
  )
}
