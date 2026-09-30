import { SlotBox } from '../../components/SlotBox'

export default function Page() {
  return (
    <SlotBox slot="cart" screen="shoes" file="@cart/shoes/page.tsx" title="신발 장바구니 (@cart)">
      <code>@cart/shoes/page.tsx</code>가 <code>/shoes</code>와 매칭돼 렌더링됐다.
    </SlotBox>
  )
}
