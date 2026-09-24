import React from 'react'
import { AREA_ID } from '../lib/theme'
import type { Theme } from '../types'

interface ThemedAreaProps {
  theme: Theme
  label: string
  /** inline-script 방식만 true — data-theme 속성 차이를 React가 받아들이게 한다 */
  suppressHydrationWarning?: boolean
  /** 요소의 첫 자식으로 들어갈 인라인 스크립트 */
  script?: React.ReactNode
  onToggle: () => void
}

/**
 * 테마를 적용받는 "데모 영역" 요소. html이 아니라 이 section의 data-theme만 바꾼다.
 * 텍스트는 테마와 무관하게 서버·클라이언트가 같게 두고(현재 테마 표시는 CSS로 전환),
 * 오직 data-theme 속성만 달라지게 해 suppressHydrationWarning의 1단계 범위 안에 둔다.
 */
export function ThemedArea({ theme, label, suppressHydrationWarning, script, onToggle }: ThemedAreaProps) {
  return (
    <section
      id={AREA_ID}
      data-theme={theme}
      suppressHydrationWarning={suppressHydrationWarning}
      className="group rounded-lg border p-4 data-[theme=light]:border-zinc-200 data-[theme=light]:bg-white data-[theme=dark]:border-zinc-800 data-[theme=dark]:bg-zinc-950"
    >
      {script}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] text-zinc-500 group-data-[theme=dark]:text-zinc-400">{label}</p>
          <h3 className="mt-0.5 text-sm font-bold text-zinc-900 group-data-[theme=dark]:text-zinc-100">
            주간 리포트 대시보드
          </h3>
        </div>
        <span className="shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] border-zinc-300 text-zinc-700 group-data-[theme=dark]:border-zinc-700 group-data-[theme=dark]:text-zinc-200">
          <span className="group-data-[theme=dark]:hidden">light</span>
          <span className="hidden group-data-[theme=dark]:inline">dark</span>
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-600 group-data-[theme=dark]:text-zinc-300">
        저장된 테마가 dark라면 이 카드는 첫 프레임부터 어두워야 합니다. 밝게 그려졌다가 바뀌면 깜빡임입니다.
      </p>
      <button
        type="button"
        onClick={onToggle}
        className="mt-3 cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-semibold bg-zinc-900 text-white group-data-[theme=dark]:bg-zinc-100 group-data-[theme=dark]:text-zinc-900"
      >
        이 영역 테마 전환
      </button>
    </section>
  )
}
