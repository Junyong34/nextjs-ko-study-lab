'use client'
import React from 'react'

export function DirectiveUseCacheFunctionDemo() {
  return (
    <div className="rounded border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 font-mono text-xs space-y-1">
      <div className="text-emerald-950 dark:text-emerald-200 font-bold">async function getProduct(id: string) {'{'}</div>
      <div className="pl-4 text-emerald-600 dark:text-emerald-400 font-bold">'use cache';</div>
      <div className="pl-4">return db.product.findUnique({'{ where: { id } }'});</div>
      <div className="text-emerald-950 dark:text-emerald-200 font-bold">{'}'}</div>
    </div>
  )
}
