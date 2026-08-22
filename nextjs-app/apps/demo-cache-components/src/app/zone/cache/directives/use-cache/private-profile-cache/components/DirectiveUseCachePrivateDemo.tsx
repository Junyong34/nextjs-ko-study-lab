'use client'
import React from 'react'

export function DirectiveUseCachePrivateDemo() {
  return (
    <div className="rounded border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-950 dark:bg-purple-950/20 font-mono text-xs space-y-1">
      <div className="font-bold text-purple-950 dark:text-purple-200">async function getMyOrders(userId: string) {'{'}</div>
      <div className="pl-4 text-purple-600 dark:text-purple-400 font-bold">'use cache: private';</div>
      <div className="pl-4">return db.orders.findMany({'{ where: { userId } }'});</div>
      <div className="font-bold text-purple-950 dark:text-purple-200">{'}'}</div>
    </div>
  )
}
