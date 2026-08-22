'use client'
import React from 'react'
export function OpenTelemetryDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736</div>
      <div className="text-zinc-500">• Span: render /shop/products (32ms)</div>
      <div className="text-zinc-500">• Span: fetch db.query("SELECT * FROM items") (18ms)</div>
    </div>
  )
}
