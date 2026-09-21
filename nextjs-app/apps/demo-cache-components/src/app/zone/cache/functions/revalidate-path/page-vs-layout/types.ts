export interface ScopeRevalidateResult {
  scope: 'page' | 'layout'
  targetPath: string
  timestamp: string
}

export interface CacheEntry {
  cacheId: string
  generatedAt: string
}
