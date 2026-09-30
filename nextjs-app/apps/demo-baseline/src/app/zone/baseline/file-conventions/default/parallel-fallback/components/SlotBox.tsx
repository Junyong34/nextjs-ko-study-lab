import type { ReactNode } from 'react'

// 관측 훅이 DOM에서 data-slot / data-screen 값을 읽는다. 표시용 상태를 따로 만들지 않고 실제 렌더 결과를 그대로 측정한다.
const TONE = {
  page: 'border-zinc-200 dark:border-zinc-800',
  default: 'border-amber-400 bg-amber-50/60 dark:border-amber-700 dark:bg-amber-950/20',
} as const

export function SlotBox({
  slot,
  screen,
  file,
  title,
  children,
}: {
  slot: string
  screen: string
  file: string
  title: string
  children: ReactNode
}) {
  const tone = screen === 'default' ? TONE.default : TONE.page
  return (
    <section data-slot={slot} data-screen={screen} className={`rounded border p-3 text-sm ${tone}`}>
      <div className="font-mono text-[11px] text-zinc-500">{file}</div>
      <h3 className="mt-0.5 font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{children}</p>
    </section>
  )
}
