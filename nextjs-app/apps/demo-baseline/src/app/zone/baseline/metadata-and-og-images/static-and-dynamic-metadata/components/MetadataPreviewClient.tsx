'use client'

import React, { useState } from 'react'

interface MetadataProps {
  title: string
  description: string
  ogType: string
  url: string
}

export function MetadataPreviewClient({
  title: initialTitle,
  description: initialDesc,
  ogType: initialOgType,
  url: initialUrl,
}: MetadataProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDesc)
  const [previewPlatform, setPreviewPlatform] = useState<'kakao' | 'twitter' | 'facebook'>('kakao')

  return (
    <div className="space-y-4">
      {/* 1. 메타데이터 편집기 툴바 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-md border border-zinc-200 bg-zinc-50 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <div>
          <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
            og:title (페이지 제목)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
            og:description (페이지 요약 설명)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* 2. 소셜 플랫폼 탭 & OG 미리보기 카드 */}
      <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            소셜 공유 미리보기 (Social Share Preview)
          </span>
          <div className="flex gap-1.5">
            {(['kakao', 'twitter', 'facebook'] as const).map((plat) => (
              <button
                key={plat}
                type="button"
                onClick={() => setPreviewPlatform(plat)}
                className={`rounded px-2.5 py-0.5 text-[11px] font-medium uppercase transition cursor-pointer ${
                  previewPlatform === plat
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {plat === 'kakao' ? '카카오톡' : plat === 'twitter' ? 'X (Twitter)' : '페이스북'}
              </button>
            ))}
          </div>
        </div>

        {/* 카카오톡 스타일 카드 */}
        {previewPlatform === 'kakao' && (
          <div className="max-w-sm rounded-lg border border-amber-300 bg-[#FEE500]/10 p-3 dark:border-amber-700/60 dark:bg-amber-950/20">
            <div className="aspect-video w-full rounded bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs font-mono">
              [OpenGraph Image 1200x630]
            </div>
            <div className="mt-2.5 space-y-1">
              <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-1">
                {title}
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {description}
              </p>
              <div className="text-[10px] text-zinc-400 font-mono">
                {initialUrl}
              </div>
            </div>
          </div>
        )}

        {/* Twitter/X 스타일 카드 */}
        {previewPlatform === 'twitter' && (
          <div className="max-w-sm overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="aspect-video w-full bg-zinc-900 flex items-center justify-center text-zinc-400 text-xs font-mono">
              [Twitter Summary Large Image]
            </div>
            <div className="p-3 space-y-1">
              <div className="text-[10px] text-zinc-400 font-mono uppercase">
                nextjs-ko-lab.dev
              </div>
              <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-1">
                {title}
              </div>
              <p className="text-[11px] text-zinc-500 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        )}

        {/* Facebook 스타일 카드 */}
        {previewPlatform === 'facebook' && (
          <div className="max-w-sm overflow-hidden rounded border border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="aspect-video w-full bg-blue-950 flex items-center justify-center text-blue-300 text-xs font-mono">
              [Facebook OG Banner]
            </div>
            <div className="p-3 space-y-0.5">
              <div className="text-[10px] text-zinc-400 font-mono uppercase">
                {initialUrl}
              </div>
              <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                {title}
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. 자동 생성된 <head> 메타 태그 인스펙터 */}
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          Next.js가 자동 주입하는 {'<'}head{'>'} 메타 태그:
        </span>
        <pre className="mt-1.5 overflow-x-auto rounded bg-zinc-900 p-2.5 font-mono text-[11px] text-emerald-400 leading-relaxed">
{`<title>${title}</title>
<meta name="description" content="${description}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:type" content="${initialOgType}" />
<meta property="og:url" content="${initialUrl}" />
<meta name="twitter:card" content="summary_large_image" />`}
        </pre>
      </div>
    </div>
  )
}
