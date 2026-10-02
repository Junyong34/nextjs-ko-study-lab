import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getDemoMetadata } from '@study/demos'
import Guide from './content/guide.mdx'
import { localMdxComponents } from './components/localMdxComponents'
import { SlotLab } from './components/SlotLab'
import { CART_COOKIE, countCart, readCart } from './lib/cart'
import type { BundleMarkers } from './types'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/mdx/custom-component-slot')

// 번들 경계 측정용 식별 문구. 서버 모듈(page.tsx)에만 적고 클라이언트에는 props로 넘긴다.
// prose는 guide.mdx 본문에, button은 AddToCartButton.tsx의 data 속성에 같은 문자열로 들어 있다.
const MARKERS: BundleMarkers = { prose: 'MDXSLOT-PROSE-7F3A', button: 'MDXSLOT-BUTTON-C1' }

export default async function DemoPage() {
  // 쿠키를 읽으므로 요청마다 렌더된다. router.refresh() 때 MDX가 새 cartCount로 다시 렌더된다.
  const cartCount = countCart(readCart((await cookies()).get(CART_COOKIE)?.value))
  return (
    <SlotLab markers={MARKERS}>
      <Guide cartCount={cartCount} components={localMdxComponents} />
    </SlotLab>
  )
}
