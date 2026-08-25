export interface SegmentCacheState {
  name: string
  type: 'layout' | 'page' | 'component'
  cachedTime: string
  version: number
}

export interface RevalidatePathResult {
  path: string
  status: 'PURGED' | 'FRESH'
  segments: SegmentCacheState[]
  message: string
  timestamp: string
}
