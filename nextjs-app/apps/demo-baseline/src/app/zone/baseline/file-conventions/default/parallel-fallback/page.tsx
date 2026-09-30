import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { SlotBox } from './components/SlotBox'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/default/parallel-fallback')

export default function Page() {
  return (
    <SlotBox slot="children" screen="home" file="parallel-fallback/page.tsx" title="상품 목록 (children)">
      URL은 <code>/</code>. 세 슬롯이 모두 자기 <code>page.tsx</code>로 렌더링된다.
    </SlotBox>
  )
}
