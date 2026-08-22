'use client'
import React from 'react'

export function MetadataRobotsDemo() {
  const ROBOTS_PATH = '/zone/baseline/file-conventions/metadata-robots/dynamic-crawler-rules/robots.txt'

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">동적 검색 크롤러 규칙 (robots.ts)</h4>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              MetadataRoute.Robots
            </span>
          </div>
          <p className="text-xs text-zinc-500">robots.ts를 통해 검색 엔진 봇별 접근 허용/차단 규칙 및 sitemap 위치를 동적으로 서빙합니다.</p>
        </div>
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1 flex justify-between">
          <span>생성된 robots.txt 텍스트 포맷:</span>
          <span className="text-[10px] text-blue-400">{ROBOTS_PATH}</span>
        </div>
        <pre className="text-[11px] text-emerald-400 bg-zinc-900 p-3 rounded overflow-x-auto">
{`User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /checkout/
Disallow: /account/
Disallow: /api/

User-Agent: Googlebot
Allow: /products/
Allow: /catalog/
Disallow: /private/

Sitemap: https://study-lab.example.com/sitemap.xml
Host: https://study-lab.example.com`}
        </pre>
      </div>
    </div>
  )
}
