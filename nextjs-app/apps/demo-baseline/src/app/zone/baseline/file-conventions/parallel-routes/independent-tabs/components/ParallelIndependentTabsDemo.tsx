'use client'
import React from 'react'
export function ParallelIndependentTabsDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
      <div className="rounded border border-blue-200 bg-blue-50/40 p-3 dark:border-blue-900">
        <span className="font-bold text-blue-900 dark:text-blue-300">슬롯 1: @specs (상세 스펙)</span>
      </div>
      <div className="rounded border border-emerald-200 bg-emerald-50/40 p-3 dark:border-emerald-900">
        <span className="font-bold text-emerald-900 dark:text-emerald-300">슬롯 2: @reviews (실시간 후기)</span>
      </div>
    </div>
  )
}
