'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { VerificationFooter } from './VerificationFooter'
import type { ProductMeta } from '../products'

const BASE_PATH = '/zone/baseline/metadata-and-og-images/static-and-dynamic-metadata'

interface LiveHead {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
}

interface MetadataPreviewClientProps {
  products: ProductMeta[]
  activeProductId?: string
  currentTitle: string
  currentDescription: string
}

export function MetadataPreviewClient({
  products,
  activeProductId,
  currentTitle,
  currentDescription,
}: MetadataPreviewClientProps) {
  const [liveHead, setLiveHead] = useState<LiveHead | null>(null)
  const [editTitle, setEditTitle] = useState(currentTitle)
  const [editDescription, setEditDescription] = useState(currentDescription)
  const [previewPlatform, setPreviewPlatform] = useState<'kakao' | 'twitter' | 'facebook'>('kakao')
  const [hasInteracted, setHasInteracted] = useState(false)

  // 이 페이지가 실제로 받은 <head> 태그를 DOM에서 직접 읽는다 — 가짜 텍스트가 아니다.
  // generateMetadata는 비동기라 클라이언트 내비게이션 시 <head> 갱신이 초기 렌더보다
  // 늦게 도착할 수 있다 — 마운트 시 한 번만 읽으면 갱신 전의 빈 값을 캡처해버리므로,
  // MutationObserver로 실제 <head> 변경을 계속 지켜보다가 바뀔 때마다 다시 읽는다.
  useEffect(() => {
    const readHead = () => {
      setLiveHead({
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
        ogDescription:
          document.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? '',
      })
    }

    readHead()

    const observer = new MutationObserver(readHead)
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['content'],
    })

    return () => observer.disconnect()
  }, [])

  const handlePlatformChange = (plat: 'kakao' | 'twitter' | 'facebook') => {
    setPreviewPlatform(plat)
    setHasInteracted(true)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* 1. 상품 프리셋 — 실제 라우트로 이동하는 링크 */}
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            상품 프리셋 (클릭 시 실제 페이지 이동 → generateMetadata 서버 재실행):
          </span>
          <Link
            href={BASE_PATH}
            className={`rounded px-2.5 py-1 text-[11px] font-medium transition ${
              !activeProductId
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            스터디 랩 메인 (정적)
          </Link>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`${BASE_PATH}/${product.id}`}
              className={`rounded px-2.5 py-1 text-[11px] font-medium transition ${
                activeProductId === product.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                  : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {product.name} (동적)
            </Link>
          ))}
        </div>

        {/* 2. 실제 <head> 인스펙터 — DOM에서 직접 읽은 값만 표시 */}
        <div className="rounded border border-emerald-200 bg-emerald-50/30 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            ✓ 실제 &lt;head&gt; 인스펙터 (document.title / meta 태그를 DOM에서 직접 읽음)
          </span>
          {liveHead ? (
            <pre className="mt-1.5 overflow-x-auto rounded bg-zinc-900 p-2.5 font-mono text-[11px] text-emerald-400 leading-relaxed">
{`<title>${liveHead.title}</title>
<meta name="description" content="${liveHead.description}" />
<meta property="og:title" content="${liveHead.ogTitle}" />
<meta property="og:description" content="${liveHead.ogDescription}" />`}
            </pre>
          ) : (
            <div className="mt-1.5 text-[11px] text-zinc-400">읽는 중...</div>
          )}
          <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            {activeProductId
              ? `현재 라우트: /${activeProductId} — generateMetadata({ params })가 params.productId="${activeProductId}"로 실제 생성한 값입니다.`
              : '현재 라우트: 메인 — 정적 metadata 객체 값입니다 (params 없음, 항상 동일).'}
          </p>
        </div>

        {/* 3. 자유 편집 SNS 미리보기 시뮬레이터 (실제 head와 무관) */}
        <div className="rounded-md border border-amber-200 bg-amber-50/20 p-3.5 text-xs dark:border-amber-900/40 dark:bg-amber-950/10 space-y-3">
          <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
            ⚠ 자유 편집 시뮬레이터 — 아래 입력은 이 화면의 미리보기 카드만 바꾸며, 실제 페이지의 &lt;head&gt;는 바꾸지 않습니다.
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                og:title (미리보기용)
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value)
                  setHasInteracted(true)
                }}
                className="mt-1 w-full rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                og:description (미리보기용)
              </label>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => {
                  setEditDescription(e.target.value)
                  setHasInteracted(true)
                }}
                className="mt-1 w-full rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-amber-200/60 pt-2.5 dark:border-amber-900/40">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              소셜 공유 미리보기
            </span>
            <div className="flex gap-1.5">
              {(['kakao', 'twitter', 'facebook'] as const).map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => handlePlatformChange(plat)}
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
                  {editTitle}
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {editDescription}
                </p>
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
                <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-1">
                  {editTitle}
                </div>
                <p className="text-[11px] text-zinc-500 line-clamp-2">
                  {editDescription}
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
                <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  {editTitle}
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  {editDescription}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3단 & 4단 검증 패널 및 개념 정리 */}
      <VerificationFooter
        activeProductId={activeProductId}
        liveHead={liveHead}
        hasInteracted={hasInteracted}
      />
    </div>
  )
}
