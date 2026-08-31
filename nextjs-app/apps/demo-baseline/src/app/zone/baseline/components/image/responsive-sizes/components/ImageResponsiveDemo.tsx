'use client'
import React, { useRef, useState } from 'react'
import Image from 'next/image'

// 데모 앱은 public/ 자산을 두지 않으므로(assetPrefix 제약) 데이터 URI SVG를 실제 이미지 소스로 사용한다.
// 이 컴포넌트는 SSR과 브라우저 양쪽에서 렌더링되므로, 두 환경에서 동일한 결과를 내는
// 인코딩 함수를 써야 하이드레이션 불일치가 생기지 않는다.
const SVG_MARKUP =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="#4f46e5"/><text x="50%" y="50%" fill="white" font-size="48" text-anchor="middle" dominant-baseline="middle">Responsive Banner</text></svg>'

function toBase64(str: string): string {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(str)
  }
  return Buffer.from(str, 'utf-8').toString('base64')
}

const BANNER_SVG = `data:image/svg+xml;base64,${toBase64(SVG_MARKUP)}`

interface ImageResponsiveDemoProps {
  device: 'mobile' | 'desktop'
  onSetDevice: (d: 'mobile' | 'desktop') => void
  onLoadInfo: (info: { naturalWidth: number; naturalHeight: number; sizesAttr: string | null }) => void
}

export function ImageResponsiveDemo({ device, onSetDevice, onLoadInfo }: ImageResponsiveDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sizes = device === 'mobile' ? '100vw' : '50vw'
  const [loadedOnce, setLoadedOnce] = useState(false)

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setLoadedOnce(true)
    onLoadInfo({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      sizesAttr: img.getAttribute('sizes'),
    })
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">디바이스 뷰포트 시뮬레이션:</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSetDevice('mobile')}
            className={`rounded px-2.5 py-1 text-xs font-bold cursor-pointer ${device === 'mobile' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}
          >
            모바일 (375px)
          </button>
          <button
            type="button"
            onClick={() => onSetDevice('desktop')}
            className={`rounded px-2.5 py-1 text-xs font-bold cursor-pointer ${device === 'desktop' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}
          >
            데스크톱 (1200px)
          </button>
        </div>
      </div>

      <div ref={containerRef} className="relative h-40 w-full overflow-hidden rounded" style={{ maxWidth: device === 'mobile' ? 220 : '100%' }}>
        <Image
          src={BANNER_SVG}
          alt="반응형 배너"
          fill
          sizes={sizes}
          unoptimized
          onLoad={handleLoad}
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="rounded bg-zinc-900 p-3 font-mono text-xs text-emerald-400">
        <div>next/image sizes prop: {sizes}</div>
        <div>실제 DOM &lt;img&gt; naturalWidth x naturalHeight: {loadedOnce ? '로드됨 (아래 검증 패널 참고)' : '로딩 중...'}</div>
      </div>
    </div>
  )
}
