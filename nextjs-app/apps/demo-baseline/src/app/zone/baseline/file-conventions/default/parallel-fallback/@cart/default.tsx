import { SlotBox } from '../components/SlotBox'

export default function Default() {
  return (
    <SlotBox slot="cart" screen="default" file="@cart/default.tsx" title="장바구니 폴백 (@cart)">
      현재 URL과 매칭되는 <code>@cart</code> 하위 페이지가 없어 <code>default.tsx</code>가 렌더링됐다.
    </SlotBox>
  )
}
