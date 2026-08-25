import React from 'react'
import { PlayCircle, ArrowRight, Layers } from 'lucide-react'

export interface DemoItem {
  /** 데모 식별 URL 경로 (예: "caching/use-cache-basic") */
  url: string
  /** 데모 제목 */
  title: string
  /** 매핑된 문서 경로 (예: "1-getting-started/caching.md") */
  doc?: string
  /** 데모가 실행되는 zone 슬러그 (예: "cache", "baseline") */
  zone?: string
  /** 데모 개발 상태 */
  status?: 'stub' | 'wip' | 'done' | string
  /** 데모 부가 설명 */
  description?: string
}

export interface DocDemoListProps {
  /** 해당 문서에 매핑된 데모 목록 */
  demos: DemoItem[]
  /** 섹션 제목 (기본값: "이 문서의 실습 데모") */
  title?: string
  className?: string
}

/**
 * 문서 하단에 해당 문서와 연결된 데모 목록을 카드 형태로 표시하는 컴포넌트입니다.
 * 클릭 시 셸의 데모 독립 열람 페이지(`/demo/${url}`)로 이동합니다.
 *
 * prose 영향 방지를 위해 not-prose와 no-underline을 적용합니다.
 */
export function DocDemoList({
  demos,
  title = '이 문서의 실습 데모',
  className = '',
}: DocDemoListProps) {
  if (!demos || demos.length === 0) {
    return null
  }

  return (
    <section
      className={`not-prose mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800 font-sans ${className}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <PlayCircle className="h-5 w-5 shrink-0 text-zinc-900 dark:text-zinc-100" />
        <h2 className="text-lg font-bold leading-none text-zinc-900 dark:text-zinc-100 m-0">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {demos.map((demo) => {
          const href = `/demo/${demo.url}`

          return (
            <a
              key={demo.url}
              href={href}
              className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600 no-underline text-inherit"
            >
              <div>
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300 no-underline">
                    {demo.title}
                  </span>
                  {demo.status && demo.status !== 'done' && (
                    <span
                      className="inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                    >
                      {demo.status}
                    </span>
                  )}
                </div>

                {demo.description && (
                  <p className="mb-3 text-xs text-zinc-500 line-clamp-2 dark:text-zinc-400 no-underline">
                    {demo.description}
                  </p>
                )}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-2.5 text-xs text-zinc-400 dark:border-zinc-800/80">
                <span className="font-mono text-[11px] text-zinc-400">
                  {demo.url}
                </span>
                <div className="flex items-center gap-1 font-medium text-zinc-800 transition-transform group-hover:translate-x-0.5 dark:text-zinc-200">
                  <span>데모 열기</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
