'use client'
import React, { useState } from 'react'
export function PwaInstallPromptDemo() {
  const [installed, setInstalled] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">PWA 매니페스트 상태: manifest.json 정상 감지됨</div>
      <button type="button" onClick={() => setInstalled(true)} className="rounded bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 cursor-pointer">
        {installed ? '[확인] 홈 화면에 추가되었습니다' : ' 쇼핑몰 앱 홈 화면에 설치하기'}
      </button>
    </div>
  )
}
