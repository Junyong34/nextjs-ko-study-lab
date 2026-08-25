export interface InventoryItem {
  sku: string
  name: string
  stock: number
  location: string
  lastSync: string
}

export interface InventoryTagPurgeResult {
  tag: string
  versionId: string
  status: 'PURGED' | 'FRESH'
  items: InventoryItem[]
  timestamp: string
}
