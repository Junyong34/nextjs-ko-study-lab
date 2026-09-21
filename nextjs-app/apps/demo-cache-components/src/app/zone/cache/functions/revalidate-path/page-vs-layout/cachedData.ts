function makeCacheEntry() {
  return {
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString(),
  }
}

export async function getLayoutBannerCache() {
  'use cache'
  return makeCacheEntry()
}

export async function getHubCache() {
  'use cache'
  return makeCacheEntry()
}

export async function getItemCache(id: string) {
  'use cache'
  return { id, ...makeCacheEntry() }
}

export async function getCategoryCache(slug: string) {
  'use cache'
  return { slug, ...makeCacheEntry() }
}
