import React from 'react'
import { PlayCircle, ArrowRight } from 'lucide-react'

export interface DemoLinkCardProps {
  /** demos.yaml의 url과 같은 값 */
  path: string
  /** demos.yaml에서 찾은 제목. 없으면 path를 대신 보여준다 */
  title?: string
  /** 무엇을 관찰하라는 한 줄. 카드 부제로 그린다 */
  caption?: string
  className?: string
}

/**
 * 문서 본문의 ` ```demo ` 코드펜스가 그리는 링크 카드입니다.
 *
 * **iframe이 아닙니다.** 문서 본문에는 iframe을 두지 않습니다
 * ([`AGENTS.md`](../../../../AGENTS.md) 규칙 16, [06. 3-2](../../../../docs/06-ui-and-screen-design.md)).
 * 예제는 언제나 `/demo/…`로 이동해서 봅니다.
 *
 * 화면 라벨은 "예제"이고 코드·URL·타입 이름은 "데모"입니다 (규칙 19).
 */
export function DemoLinkCard({ path, title, caption, className = '' }: DemoLinkCardProps) {
  return (
    <a
      href={`/demo/${path}`}
      className={`group my-6 flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-xs transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600 ${className}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <PlayCircle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-900 dark:text-zinc-100" />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
            예제 — {title || path}
          </div>
          {caption && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{caption}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-zinc-800 transition-transform group-hover:translate-x-0.5 dark:text-zinc-200">
        <span>열기</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </a>
  )
}
