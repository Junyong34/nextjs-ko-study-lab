'use client'

import { useEffect, useRef, useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useIframeProbe } from '../hooks/useIframeProbe'
import { BASE_PATH, STORAGE_KEY } from '../lib/theme'
import { ComparisonTable } from './ComparisonTable'
import { VerificationPanel } from './VerificationPanel'

const VARIANTS = [
  { path: 'use-effect', title: 'A. useEffect 방식', file: 'use-effect/page.tsx' },
  { path: 'inline-script', title: 'B. 인라인 스크립트 방식', file: 'inline-script/page.tsx' },
] as const

export function ComparisonPlayground() {
  const [stored, setStored] = useState<string | null | undefined>(undefined)
  const [loadKey, setLoadKey] = useState(0)
  const effectRef = useRef<HTMLIFrameElement>(null)
  const scriptRef = useRef<HTMLIFrameElement>(null)
  const effect = useIframeProbe(effectRef, loadKey)
  const script = useIframeProbe(scriptRef, loadKey)

  useEffect(() => {
    try {
      setStored(localStorage.getItem(STORAGE_KEY))
    } catch {
      setStored(null)
    }
  }, [loadKey])

  const reloadBoth = () => setLoadKey((k) => k + 1)
  const save = (theme: 'light' | 'dark') => {
    localStorage.setItem(STORAGE_KEY, theme)
    reloadBoth()
  }
  const reset = () => {
    localStorage.removeItem(STORAGE_KEY)
    reloadBoth()
  }

  const btn =
    'cursor-pointer rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'

  return (
    <>
      <DemoPlaygroundCard title="같은 저장값, 두 가지 적용 방식 (실제 하위 라우트를 iframe으로 하드 로드)">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={btn} onClick={() => save('dark')}>
            dark 저장 후 두 방식 새로고침
          </button>
          <button type="button" className={btn} onClick={() => save('light')}>
            light 저장 후 새로고침
          </button>
          <button type="button" className={btn} onClick={reloadBoth}>
            두 방식 다시 로드
          </button>
          <DemoResetButton onReset={reset} label="저장값 삭제(초기화)" />
          <span className="font-mono text-[11px] text-zinc-500">
            localStorage[&quot;{STORAGE_KEY}&quot;] = {stored === undefined ? '...' : String(stored)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {VARIANTS.map((v) => (
            <div key={v.path} className="rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-1.5 dark:border-zinc-800">
                <span className="text-xs font-semibold">{v.title}</span>
                <a
                  href={`${BASE_PATH}/${v.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[10px] text-zinc-500 underline"
                >
                  {v.file}
                </a>
              </div>
              <iframe
                key={`${v.path}-${loadKey}`}
                ref={v.path === 'use-effect' ? effectRef : scriptRef}
                src={`${BASE_PATH}/${v.path}`}
                title={v.title}
                className="block h-[340px] w-full rounded-b-lg bg-transparent"
              />
            </div>
          ))}
        </div>

        <ComparisonTable effect={effect} script={script} />
      </DemoPlaygroundCard>
      <VerificationPanel effect={effect} script={script} />
    </>
  )
}
