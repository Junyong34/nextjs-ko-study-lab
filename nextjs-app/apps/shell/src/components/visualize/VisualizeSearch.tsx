import { useRef } from 'react'
import { Search, X } from 'lucide-react'

interface VisualizeSearchProps {
  value: string
  onChange: (value: string) => void
  onCompositionStart: (value: string) => void
  onCompositionEnd: (value: string) => void
}

export function VisualizeSearch({ value, onChange, onCompositionStart, onCompositionEnd }: VisualizeSearchProps) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <div>
      <label htmlFor="visualize-search" className="sr-only">시각화 검색</label>
      <div className="relative max-w-2xl">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
        <input
          ref={input}
          id="visualize-search"
          type="search"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onCompositionStart={(event) => onCompositionStart(event.currentTarget.value)}
          onCompositionEnd={(event) => onCompositionEnd(event.currentTarget.value)}
          placeholder="검색 · ISR, use cache, 캐시"
          className="visualize-search w-full min-h-11 rounded-lg border border-zinc-200 bg-zinc-50/80 pl-10 pr-12 text-base sm:text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus-visible:outline-zinc-100"
        />
        {value && (
          <button type="button" aria-label="검색어 지우기" onClick={() => { onChange(''); input.current?.focus() }}
            className="visualize-press absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-zinc-500">
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
