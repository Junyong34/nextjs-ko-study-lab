import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { VisualizeEntry } from './catalog'
import { rememberVisualizeSelection } from './useVisualizeNavigation'

export function VisualizeRow({ entry }: { entry: VisualizeEntry }) {
  return (
    <li>
      <Link
        id={`visualize-${entry.key}`}
        href={`/visualize/${entry.key}`}
        onClick={(event) => rememberVisualizeSelection(event, entry.key)}
        className="group flex min-h-11 items-center gap-4 rounded-lg px-3 py-4 sm:px-4 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-3">
            <h3 className="text-sm sm:text-base font-semibold tracking-tight">{entry.title}</h3>
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${entry.badge.className}`}>
              {entry.badge.label}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 break-keep">{entry.summary}</p>
        </div>
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
      </Link>
    </li>
  )
}
