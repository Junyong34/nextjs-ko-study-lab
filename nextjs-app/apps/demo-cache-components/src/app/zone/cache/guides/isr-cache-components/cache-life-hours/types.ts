export interface CachedHeroBanner {
  bannerId: string
  title: string
  subtitle: string
  discountRate: string
  cachedAt: string
  hitType: '0ms HIT' | 'INITIAL_FETCH'
  fetchLatencyMs: number
}
