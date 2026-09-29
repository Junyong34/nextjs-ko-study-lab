export interface ProductCacheEntry {
  id: string
  cacheId: string
  generatedAt: string
}

export interface RevalidateResult {
  mode: 'pattern' | 'instance'
  targetPath: string
  timestamp: string
}
