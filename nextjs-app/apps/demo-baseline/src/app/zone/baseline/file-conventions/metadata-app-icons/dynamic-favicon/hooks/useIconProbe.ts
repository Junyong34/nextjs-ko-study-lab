'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SEGMENT_PATH } from '../specs'
import type { HeadIconLink, IconFetchResult, MeasuredIcon, ProbeSnapshot } from '../types'

const ICON_SELECTOR = 'link[rel="icon"], link[rel="apple-touch-icon"], link[rel="shortcut icon"]'

function readLinks(root: ParentNode): HeadIconLink[] {
  return Array.from(root.querySelectorAll<HTMLLinkElement>(ICON_SELECTOR)).map((el) => ({
    rel: el.getAttribute('rel') ?? '',
    href: el.getAttribute('href') ?? '',
    sizes: el.getAttribute('sizes'),
    type: el.getAttribute('type'),
    inHead: el.closest('head') !== null,
  }))
}

function decodeImage(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => reject(new Error('이미지 디코딩 실패'))
    img.src = src
  })
}

async function fetchIcon(href: string): Promise<IconFetchResult> {
  const empty: IconFetchResult = {
    status: null, contentType: null, cacheControl: null, nextCache: null,
    byteLength: null, naturalWidth: null, naturalHeight: null, previewUrl: null, error: null,
  }
  try {
    const res = await fetch(href, { cache: 'no-store' })
    const blob = await res.blob()
    const base: IconFetchResult = {
      ...empty,
      status: res.status,
      contentType: res.headers.get('content-type'),
      cacheControl: res.headers.get('cache-control'),
      nextCache: res.headers.get('x-nextjs-cache'),
      byteLength: blob.size,
    }
    if (!res.ok || !blob.type.startsWith('image/')) return base
    const previewUrl = URL.createObjectURL(blob)
    const { width, height } = await decodeImage(previewUrl)
    return { ...base, previewUrl, naturalWidth: width, naturalHeight: height }
  } catch (err: unknown) {
    return { ...empty, error: err instanceof Error ? err.message : String(err) }
  }
}

async function readNoResetLinks(): Promise<HeadIconLink[]> {
  const res = await fetch(`${SEGMENT_PATH}/no-reset`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`no-reset 응답 ${res.status}`)
  const doc = new DOMParser().parseFromString(await res.text(), 'text/html')
  return readLinks(doc)
}

export function useIconProbe() {
  const [snapshot, setSnapshot] = useState<ProbeSnapshot | null>(null)
  const [isMeasuring, setIsMeasuring] = useState(false)
  const blobUrls = useRef<string[]>([])

  const revokeAll = useCallback(() => {
    blobUrls.current.forEach((url) => URL.revokeObjectURL(url))
    blobUrls.current = []
  }, [])

  useEffect(() => revokeAll, [revokeAll])

  const measure = useCallback(async () => {
    setIsMeasuring(true)
    revokeAll()
    const links = readLinks(document)
    const icons: MeasuredIcon[] = await Promise.all(
      links.map(async (link) => {
        const url = new URL(link.href, window.location.href)
        const result = await fetchIcon(link.href)
        if (result.previewUrl) blobUrls.current.push(result.previewUrl)
        return { link, pathname: url.pathname, query: url.search, result }
      }),
    )
    let noResetLinks: HeadIconLink[] | null = null
    let noResetError: string | null = null
    try {
      noResetLinks = await readNoResetLinks()
    } catch (err: unknown) {
      noResetError = err instanceof Error ? err.message : String(err)
    }
    setSnapshot({ measuredAt: new Date().toLocaleTimeString('ko-KR'), icons, noResetLinks, noResetError })
    setIsMeasuring(false)
  }, [revokeAll])

  const reset = useCallback(() => {
    revokeAll()
    setSnapshot(null)
  }, [revokeAll])

  return { snapshot, isMeasuring, measure, reset }
}
