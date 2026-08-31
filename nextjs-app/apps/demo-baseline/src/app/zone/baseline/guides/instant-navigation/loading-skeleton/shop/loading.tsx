import React from 'react'

export default function Loading() {
  return (
    <div className="space-y-2" data-testid="shop-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      ))}
    </div>
  )
}
