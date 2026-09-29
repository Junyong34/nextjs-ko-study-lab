export const HUB_PATH = '/zone/cache/functions/revalidate-path/dynamic-route'
export const PRODUCT_PAGE_PATTERN = `${HUB_PATH}/products/[id]`
export const PRODUCT_ID_A = '1'
export const PRODUCT_ID_B = '2'

export function buildProductPath(id: string) {
  return `${HUB_PATH}/products/${id}`
}
