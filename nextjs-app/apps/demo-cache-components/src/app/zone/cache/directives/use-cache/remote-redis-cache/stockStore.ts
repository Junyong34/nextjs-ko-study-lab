const INITIAL_STOCK = 25

let remoteStock = INITIAL_STOCK
let totalPurchases = 0

export function getRemoteStockState() {
  return { stock: remoteStock, totalPurchases }
}

export function applyRemotePurchase() {
  remoteStock = Math.max(0, remoteStock - 1)
  totalPurchases += 1
  return getRemoteStockState()
}

export function applyRemoteRestock() {
  remoteStock = INITIAL_STOCK
  return getRemoteStockState()
}
