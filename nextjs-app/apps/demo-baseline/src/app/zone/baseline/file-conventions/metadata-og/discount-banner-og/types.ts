import type { DiscountSnapshot } from './discount-data'

export type ImageChannel = 'og' | 'twitter'

/** 문서에서 읽은 meta 태그 한 줄 */
export interface MetaTagRow {
  key: string
  content: string
  /** 이 태그가 실제로 놓인 위치 (head 안인지) */
  inHead: boolean
}

/** 이미지 URL을 한 번 fetch한 결과 */
export interface ImageFetchResult {
  requestedPath: string
  status: number
  contentType: string | null
  byteSize: number
  generatedAt: string | null
  rate: number | null
  cacheControl: string | null
  nextCache: string | null
  fetchedAt: string
}

export interface DiscountSourceResponse {
  serverNow: string
  current: DiscountSnapshot
  atGeneration: DiscountSnapshot | null
}

/** 채널(og / twitter) 하나에 대한 전체 실측 결과 */
export interface ImageProbe {
  channel: ImageChannel
  metaUrl: string
  first: ImageFetchResult
  second: ImageFetchResult
  previewUrl: string
  source: DiscountSourceResponse
}

export interface Inspection {
  domMeta: MetaTagRow[]
  htmlMeta: MetaTagRow[]
  probes: Partial<Record<ImageChannel, ImageProbe>>
  error: string | null
}
