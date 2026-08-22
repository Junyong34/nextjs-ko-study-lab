'use client'
import React from 'react'

export function MetadataManifestDemo() {
  const MANIFEST_PATH = '/zone/baseline/file-conventions/metadata-manifest/dynamic-pwa-manifest/manifest.webmanifest'

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">동적 웹 앱 매니페스트 (manifest.ts)</h4>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              MetadataRoute.Manifest
            </span>
          </div>
          <p className="text-xs text-zinc-500">manifest.ts를 통해 PWA 설치 정보 및 테마 색상을 타입 안전하게 동적 생성합니다.</p>
        </div>
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1 flex justify-between">
          <span>생성된 PWA 매니페스트 데이터:</span>
          <span className="text-[10px] text-blue-400">{MANIFEST_PATH}</span>
        </div>
        <pre className="text-[11px] text-emerald-400 bg-zinc-900 p-3 rounded overflow-x-auto">
{`{
  "name": "Next.js 스터디 랩 쇼핑몰 (PWA)",
  "short_name": "스터디몰",
  "start_url": "${MANIFEST_PATH}",
  "display": "standalone",
  "theme_color": "#2563eb",
  "background_color": "#ffffff"
}`}
        </pre>
      </div>
    </div>
  )
}
