function makeCacheEntry() {
  return {
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}

export async function getProductCache(id: string) {
  'use cache'
  return { id, ...makeCacheEntry() }
}
