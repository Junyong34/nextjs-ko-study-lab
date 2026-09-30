import { SlotBox } from '../components/SlotBox'

export default function Page() {
  return (
    <SlotBox slot="cart" screen="home" file="@cart/page.tsx" title="장바구니 (@cart)">
      <code>@cart</code> 슬롯의 루트 화면. 담긴 상품 2개.
    </SlotBox>
  )
}
