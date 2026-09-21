import type { InventoryItem } from './types'

export let inventoryDb: InventoryItem[] = [
  { sku: 'SKU-HD01', name: '노이즈캔슬링 무선 헤드폰', stock: 8, location: '물류센터 A (김포)', lastSync: '초기 로드' },
  { sku: 'SKU-MS02', name: 'RGB 초경량 게이밍 마우스', stock: 24, location: '물류센터 B (이천)', lastSync: '초기 로드' },
]

export function applyRandomStockDrop(time: string): InventoryItem[] {
  inventoryDb = inventoryDb.map((item) => ({
    ...item,
    stock: Math.max(1, item.stock - Math.floor(Math.random() * 2 + 1)),
    lastSync: time,
  }))
  return inventoryDb
}
