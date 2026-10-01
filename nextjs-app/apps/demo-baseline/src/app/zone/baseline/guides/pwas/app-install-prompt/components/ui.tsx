import React from 'react'

const BTN =
  'rounded border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer'

export function ActionButton({
  tone = 'default',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'default' | 'primary' }) {
  const color =
    tone === 'primary'
      ? 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700'
      : 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'
  return <button type="button" className={`${BTN} ${color} ${className}`} {...props} />
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5 rounded border border-zinc-200 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{title}</h4>
      {children}
    </section>
  )
}

/** ok: true 통과 / false 문제 / null 측정 불가·대기 */
export function StatusRow({ ok, label, detail }: { ok: boolean | null; label: string; detail: string }) {
  const mark = ok === true ? '✓' : ok === false ? '✗' : '–'
  const color =
    ok === true
      ? 'text-emerald-600 dark:text-emerald-400'
      : ok === false
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-zinc-400'
  return (
    <li className="flex items-start gap-2 text-[11px] leading-snug">
      <span className={`mt-px w-3 shrink-0 text-center font-mono font-bold ${color}`}>{mark}</span>
      <span className="text-zinc-800 dark:text-zinc-200">
        <span className="font-semibold">{label}</span>
        <span className="text-zinc-500 dark:text-zinc-400"> — {detail}</span>
      </span>
    </li>
  )
}
