import React from 'react'

export default function TemplateLifecycleProduct1Page() {
  return (
    <div className="space-y-1.5 rounded-xl border border-zinc-300 bg-white p-4 shadow-2xs dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          page.tsx (에어 줌 프로 러닝화 라우트)
        </span>
        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
          159,000원
        </span>
      </div>
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pt-1">
        에어 줌 프로 러닝화
      </h3>
      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
        최상의 쿠셔닝과 반발력을 제공하는 프리미엄 로드 러닝화입니다. 하단 template.tsx 폼에 후기를 작성한 후 상단 맨투맨 탭을 눌러보세요.
      </p>
    </div>
  )
}
