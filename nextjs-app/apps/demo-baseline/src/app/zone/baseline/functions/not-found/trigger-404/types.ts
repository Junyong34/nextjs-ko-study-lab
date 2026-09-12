export const TRIGGER_404_BASE_PATH = '/zone/baseline/functions/not-found/trigger-404'

export interface StoreInfo {
  id: string
  name: string
  address: string
}

/**
 * stores/[storeId]/layout.tsx가 참조하는 카탈로그.
 * 여기 없는 storeId는 layout.tsx 단계에서 notFound()를 호출한다.
 */
export const STORE_CATALOG: Record<string, StoreInfo> = {
  'STORE-101': { id: 'STORE-101', name: '강남 플래그십 스토어', address: '서울 강남구 테헤란로 101' },
  'STORE-102': { id: 'STORE-102', name: '홍대 팝업 스토어', address: '서울 마포구 홍익로 102' },
}

export interface InventoryItem {
  sku: string
  name: string
  stock: number
}

/**
 * api/inventory/[sku]/route.ts(Route Handler)가 참조하는 카탈로그.
 * 여기 없는 sku는 Route Handler 내부에서 notFound()를 호출한다.
 */
export const INVENTORY_CATALOG: Record<string, InventoryItem> = {
  'SKU-100': { sku: 'SKU-100', name: '프리미엄 러닝화', stock: 42 },
  'SKU-101': { sku: 'SKU-101', name: '방수 윈드브레이커', stock: 17 },
}
