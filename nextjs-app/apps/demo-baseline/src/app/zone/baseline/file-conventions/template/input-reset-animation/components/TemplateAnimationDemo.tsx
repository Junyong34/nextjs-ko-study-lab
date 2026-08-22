'use client'
import React, { useState } from 'react'
export function TemplateAnimationDemo() {
  const [review, setReview] = useState('훌륭한 상품입니다!')
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <label className="font-bold text-zinc-900 dark:text-zinc-100">후기 작성 폼 (template.tsx 내부):</label>
      <input type="text" value={review} onChange={e => setReview(e.target.value)} className="w-full rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
    </div>
  )
}
