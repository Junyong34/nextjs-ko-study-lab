'use client'
import React from 'react'

export function DirectiveUseCacheRemoteDemo() {
  return (
    <div className="rounded border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-950 dark:bg-blue-950/20 font-mono text-xs space-y-1">
      <div className="font-bold text-blue-950 dark:text-blue-200">async function getGlobalCatalog() {'{'}</div>
      <div className="pl-4 text-blue-600 dark:text-blue-400 font-bold">'use cache: remote';</div>
      <div className="pl-4">return redisCluster.get('catalog:v3');</div>
      <div className="font-bold text-blue-950 dark:text-blue-200">{'}'}</div>
    </div>
  )
}
