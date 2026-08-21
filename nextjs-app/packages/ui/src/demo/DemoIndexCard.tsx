import React from 'react'
import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { cardClass } from '../primitives/Card'
import { DemoStatusBadge } from './DemoStatus'

export interface DemoIndexCardProps {
  /** 학습자 URL 조각 (예: "caching/basic") */
  url: string
  title: string
  zone: string
  status: string
  /** 근거 문서 경로 (예: "1-getting-started/caching.md") */
  doc: string
  /** 근거 문서의 사이트 URL */
  docUrl: string
}

/** 데모 색인(`/demo`)의 카드. 문서 하단 카드(`DocDemoList`)와는 구조가 다르다. */
export function DemoIndexCard({ url, title, zone, status, doc, docUrl }: DemoIndexCardProps) {
  return (
    <div className={cardClass({ density: 'index' })}>
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {url}
            </span>
          </div>
          <DemoStatusBadge status={status} />
        </div>

        <h3 className="mt-3 text-base font-bold text-zinc-900 transition group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
          <Link href={`/demo/${url}`}>{title}</Link>
        </h3>

        <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <BookOpen className="h-3.5 w-3.5" />
          <span>관련 문서: </span>
          <Link
            href={docUrl}
            className="text-zinc-700 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            {doc}
          </Link>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <span className="text-xs text-zinc-400">독립 실행 환경 호스팅</span>

        <Link
          href={`/demo/${url}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <span>데모 열기</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
