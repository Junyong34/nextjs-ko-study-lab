import { SlotBox } from '../components/SlotBox'

export default function Page() {
  return (
    <SlotBox slot="promo" screen="home" file="@promo/page.tsx" title="기획전 배너 (@promo)">
      <code>@promo</code> 슬롯의 루트 화면. 이 슬롯에는 <code>shoes</code>·<code>settings</code> 하위 페이지가 없다.
    </SlotBox>
  )
}
