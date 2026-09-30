import { SlotBox } from '../components/SlotBox'

export default function Page() {
  return (
    <SlotBox slot="children" screen="shoes" file="parallel-fallback/shoes/page.tsx" title="신발 카테고리 (children)">
      URL <code>/shoes</code>. children과 @cart는 <code>shoes</code> 세그먼트가 있고 @promo에는 없다.
    </SlotBox>
  )
}
