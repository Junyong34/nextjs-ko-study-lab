export interface PodInstance {
  id: string
  name: string
  region: string
}

export interface RemoteStockSnapshot {
  stock: number
  totalPurchases: number
  cacheId: string
  generatedAt: string
}

export interface RemoteStockActionResult {
  stock: number
  totalPurchases: number
  timestamp: string
}
