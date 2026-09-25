import type { MetadataRoute } from 'next'

/** 테마 프리셋 1개. manifest.ts, actions.ts, 실습 화면이 이 형태를 공유한다. */
export interface ThemePreset {
  id: string
  label: string
  themeColor: string
  backgroundColor: string
}

/** 실습 화면이 GET /manifest.webmanifest를 실제로 fetch한 결과를 담는 상태값 */
export interface ManifestFetchResult {
  presetId: string
  requestedUrl: string
  status: number | null
  contentType: string | null
  cacheControl: string | null
  manifest: MetadataRoute.Manifest | null
  rawText: string
  fetchedAt: string | null
}
