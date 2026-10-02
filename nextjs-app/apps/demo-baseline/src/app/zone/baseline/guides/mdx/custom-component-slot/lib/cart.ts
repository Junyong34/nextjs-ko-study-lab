// Route Handler(api/cart)와 page.tsx가 함께 쓰는 장바구니 쿠키 규칙. 쿠키 이름에 데모 접두사를 붙인다.
export const CART_COOKIE = 'mdx-slot-cart'
export const PRODUCT_STOCK: Record<string, number> = { 'WB-002': 3 }

export type Cart = Record<string, number>

export function readCart(raw: string | undefined): Cart {
  if (!raw) return {}
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    return Object.fromEntries(
      Object.entries(parsed).filter(([sku, qty]) => sku in PRODUCT_STOCK && Number.isInteger(qty) && (qty as number) > 0),
    ) as Cart
  } catch {
    return {}
  }
}

export const countCart = (cart: Cart) => Object.values(cart).reduce((sum, qty) => sum + qty, 0)
