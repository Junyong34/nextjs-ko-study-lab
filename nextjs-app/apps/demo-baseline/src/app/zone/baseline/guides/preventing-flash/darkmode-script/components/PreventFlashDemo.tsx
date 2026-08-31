'use client'
import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'demo_darkmode-script_theme'

export function PreventFlashDemo() {
  const [domTheme, setDomTheme] = useState<string | null>(null)

  useEffect(() => {
    // 하이드레이션 전에 인라인 스크립트가 이미 설정해 둔 값을 읽는다(React가 아니라 순수 DOM 조작 결과).
    setDomTheme(document.documentElement.dataset.demoTheme || null)
  }, [])

  const handleToggle = () => {
    const current = localStorage.getItem(STORAGE_KEY) || 'dark'
    const next = current === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, next)
    // 새로고침해야 "인라인 스크립트가 하이드레이션 전에 먼저 적용했는지"를 실제로 검증할 수 있다.
    window.location.reload()
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">
          document.documentElement.dataset.demoTheme (인라인 스크립트가 하이드레이션 전에 설정): {domTheme ?? '읽는 중...'}
        </span>
        <button
          type="button"
          onClick={handleToggle}
          className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          테마 토글 (새로고침하며 검증)
        </button>
      </div>
      <p className="text-xs text-zinc-500">
        토글 후 새로고침되면, React가 렌더링을 시작하기도 전에 인라인 스크립트가 이미 data-demo-theme을 설정해 둔 상태로 페이지가 도착합니다.
      </p>
    </div>
  )
}
