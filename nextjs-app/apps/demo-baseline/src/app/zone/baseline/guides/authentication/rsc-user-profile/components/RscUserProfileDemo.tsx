'use client'
import React from 'react'
export function RscUserProfileDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100"> 서버 사이드 렌더링 회원 정보:</div>
      <div className="font-mono text-zinc-600 dark:text-zinc-400">• 회원명: 홍길동 (VIP 등급)</div>
      <div className="font-mono text-zinc-600 dark:text-zinc-400">• 적립금: 15,200 P | 쿠폰: 3장</div>
    </div>
  )
}
