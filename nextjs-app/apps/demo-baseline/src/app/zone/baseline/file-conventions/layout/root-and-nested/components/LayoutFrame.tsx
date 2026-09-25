import React from 'react'

interface LayoutFrameProps {
  /** 서버 HTML에 data-layout으로 박히는 자기 파일 경로 */
  file: string
  caption: string
  tone: 'blue' | 'amber'
  children: React.ReactNode
}

const TONES = {
  blue: 'border-blue-300 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/20',
  amber: 'border-amber-300 bg-amber-50/30 dark:border-amber-800 dark:bg-amber-950/20',
}

/**
 * 중첩 layout.tsx들이 공통으로 쓰는 서버 컴포넌트 프레임.
 * 자신을 표시하는 data-layout 속성을 서버에서 렌더하고 children을 그 안에 둔다.
 */
export function LayoutFrame({ file, caption, tone, children }: LayoutFrameProps) {
  return (
    <div data-layout={file} className={`min-w-0 space-y-2 rounded border p-3 ${TONES[tone]}`}>
      <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
        <code className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{file}</code> · {caption}
      </p>
      {children}
    </div>
  )
}
