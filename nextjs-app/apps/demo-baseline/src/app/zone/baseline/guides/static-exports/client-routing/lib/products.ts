import type { Product } from '../types'

export const BASE = '/zone/baseline/guides/static-exports/client-routing'

export const PRODUCTS: Product[] = [
  { id: 'running-shoes', name: '프리미엄 러닝화', price: '129,000원' },
  { id: 'windbreaker', name: '방수 윈드브레이커', price: '189,000원' },
]

/** generateStaticParams에 없는 id. dynamicParams = false라서 404가 되어야 한다 */
export const UNKNOWN_ID = 'limited-edition'

export const relativePath = (pathname: string) =>
  pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname

/**
 * output: 'export' 프로덕션 빌드에서 라우터가 대신 요청할 파일 경로.
 * next/dist/client/components/router-reducer/fetch-server-response.js의 규칙을 그대로 옮긴 계산이며 실측이 아니다.
 */
export function exportPayloadPath(pathname: string, trailingSlash = false) {
  if (trailingSlash || pathname.endsWith('/')) return `${pathname.replace(/\/$/, '')}/index.txt`
  return `${pathname}.txt`
}
