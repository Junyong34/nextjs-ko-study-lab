'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IMAGE_HEADERS } from '../image-config'
import type {
  DiscountSourceResponse,
  ImageChannel,
  ImageFetchResult,
  ImageProbe,
  Inspection,
  MetaTagRow,
} from '../types'

const META_SELECTOR = 'meta[property^="og:image"], meta[name^="twitter:image"]'
const SOURCE_ENDPOINT =
  '/zone/baseline/file-conventions/metadata-og/discount-banner-og/discount-source'

const EMPTY: Inspection = { domMeta: [], htmlMeta: [], probes: {}, error: null }

function readMeta(doc: Document): MetaTagRow[] {
  return Array.from(doc.querySelectorAll<HTMLMetaElement>(META_SELECTOR)).map((el) => ({
    key: el.getAttribute('property') ?? el.getAttribute('name') ?? '',
    content: el.content,
    inHead: el.closest('head') !== null,
  }))
}

/**
 * metadataBase(루트 layout의 siteUrl) 때문에 meta 태그의 이미지 URL은 배포 도메인 절대 URL이다.
 * 같은 이미지 라우트를 지금 이 서버에서 실측하기 위해 path + query(해시)만 떼어 동일 출처로 요청한다.
 */
function toSameOriginPath(metaUrl: string): string {
  const url = new URL(metaUrl, window.location.href)
  return `${url.pathname}${url.search}`
}

async function fetchImage(path: string): Promise<{ result: ImageFetchResult; blob: Blob }> {
  const res = await fetch(path, { cache: 'no-store' })
  const blob = await res.blob()
  const rate = res.headers.get(IMAGE_HEADERS.rate)
  return {
    blob,
    result: {
      requestedPath: path,
      status: res.status,
      contentType: res.headers.get('content-type'),
      byteSize: blob.size,
      generatedAt: res.headers.get(IMAGE_HEADERS.generatedAt),
      rate: rate === null ? null : Number(rate),
      cacheControl: res.headers.get('cache-control'),
      nextCache: res.headers.get('x-nextjs-cache') ?? res.headers.get('x-nextjs-prerender'),
      fetchedAt: new Date().toISOString(),
    },
  }
}

async function probe(channel: ImageChannel, metaUrl: string): Promise<ImageProbe> {
  const path = toSameOriginPath(metaUrl)
  // 같은 URL을 연속 2회 요청: 생성 시각이 바뀌면 요청마다 새로 렌더링된 것이다.
  const first = await fetchImage(path)
  const second = await fetchImage(path)
  const at = encodeURIComponent(first.result.generatedAt ?? '')
  const sourceRes = await fetch(`${SOURCE_ENDPOINT}?at=${at}`, { cache: 'no-store' })
  const source = (await sourceRes.json()) as DiscountSourceResponse
  return {
    channel,
    metaUrl,
    first: first.result,
    second: second.result,
    previewUrl: URL.createObjectURL(second.blob),
    source,
  }
}

export function useOgInspection() {
  const [inspection, setInspection] = useState<Inspection>(EMPTY)
  const [isRunning, setIsRunning] = useState(false)
  const previewUrls = useRef<string[]>([])

  const revokePreviews = () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrls.current = []
  }

  // 1) 마운트 직후: 브라우저가 파싱한 현재 문서 DOM에서 meta 태그를 읽는다.
  useEffect(() => {
    setInspection((prev) => ({ ...prev, domMeta: readMeta(document) }))
    return revokePreviews
  }, [])

  const run = useCallback(async () => {
    setIsRunning(true)
    revokePreviews()
    try {
      // 2) 서버가 보낸 HTML 원문을 다시 받아 <head>를 파싱한다 (하이드레이션 전 상태).
      const html = await (await fetch(window.location.pathname, { cache: 'no-store' })).text()
      const htmlMeta = readMeta(new DOMParser().parseFromString(html, 'text/html'))
      const find = (key: string) => htmlMeta.find((row) => row.key === key)?.content

      // 3) meta 태그에 적힌 이미지 URL을 실제로 요청한다.
      const probes: Inspection['probes'] = {}
      const ogUrl = find('og:image')
      const twitterUrl = find('twitter:image')
      if (ogUrl) probes.og = await probe('og', ogUrl)
      if (twitterUrl) probes.twitter = await probe('twitter', twitterUrl)
      Object.values(probes).forEach((p) => p && previewUrls.current.push(p.previewUrl))

      setInspection({ domMeta: readMeta(document), htmlMeta, probes, error: null })
    } catch (err: unknown) {
      setInspection((prev) => ({ ...prev, error: String(err) }))
    } finally {
      setIsRunning(false)
    }
  }, [])

  const reset = useCallback(() => {
    revokePreviews()
    setInspection({ ...EMPTY, domMeta: readMeta(document) })
  }, [])

  return { inspection, isRunning, run, reset }
}
