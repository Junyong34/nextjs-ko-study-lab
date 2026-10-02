import React from 'react'

// 대상 라우트의 공통 본문. 이 화면들은 헤더 측정용이며 학습자가 직접 열 필요는 없다.
export function TargetFrame({ title, stampLabel, stamp }: { title: string; stampLabel: string; stamp: number }) {
  return (
    <main className="space-y-2 p-6 text-sm">
      <h1 className="font-semibold">{title}</h1>
      <p>
        {stampLabel}: <span className="font-mono">{new Date(stamp).toISOString()}</span>
      </p>
      <p className="text-zinc-500">expireTime 데모가 이 응답의 Cache-Control 헤더를 측정합니다.</p>
    </main>
  )
}
