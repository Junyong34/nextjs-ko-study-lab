import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { CartLab } from './components/CartLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/swr/mutation-optimistic')

// 장바구니 데이터는 이 페이지가 아니라 브라우저의 useSWR이 api/cart Route Handler에서 읽는다.
// SWRConfig(캐시 provider·fetcher)는 zone 루트가 아니라 CartLab 안에서만 감싼다.
export default function DemoPage() {
  return <CartLab />
}
