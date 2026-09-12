import { MOCK_PRODUCTS } from '@study/demo-kit'

export const DEMO_PATH = '/zone/baseline/functions/redirect/handler-307'
export const RECEIPT_PATH = `${DEMO_PATH}/receipt`
export const DEMO_PRODUCTS = MOCK_PRODUCTS.slice(0, 2)
export const PRODUCT_IDS = DEMO_PRODUCTS.map(product => product.id)
