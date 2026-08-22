export interface PrefetchLogItem {
  id: string
  timestamp: string
  action: string
  target: string
  status: 'prefetched' | 'navigated' | 'reset'
}
