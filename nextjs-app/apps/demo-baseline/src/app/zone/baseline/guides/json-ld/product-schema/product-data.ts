import type { ProductRecord } from './types'

/**
 * 상품 DB 대역. 외부 네트워크 없이 서버에서만 읽는다.
 * description에는 판매자가 입력한 악성 문자열이 섞여 있다.
 * `</script>`로 스크립트 경계를 닫고 마크업을 끼워 넣으려는 형태지만,
 * 주입 대상은 src·이벤트 핸들러가 없는 <img> 한 개라 어떤 파서에서도 코드가 실행되지 않는다.
 */
export const INJECTION_MARKER = 'jsonld-breakout'

const PRODUCTS: Record<string, ProductRecord> = {
  'KB-104': {
    sku: 'KB-104',
    name: '저소음 기계식 키보드 K104',
    brand: 'Study Lab Gear',
    description: `저소음 적축 스위치, PBT 키캡. 판매자 메모: </script><img data-injected=${INJECTION_MARKER} alt=injected>`,
    image: 'https://study-lab.example.com/products/kb-104.webp',
    price: 149000,
    priceCurrency: 'KRW',
    availability: 'InStock',
  },
}

export async function getProduct(sku: string): Promise<ProductRecord> {
  const product = PRODUCTS[sku]
  if (!product) throw new Error(`unknown sku: ${sku}`)
  return product
}
