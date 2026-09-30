import { SlotBox } from '../../components/SlotBox'

export default function Page() {
  return (
    <SlotBox slot="side" screen="strict-home" file="strict/@side/page.tsx" title="배송 안내 (@side)">
      <code>@side</code> 슬롯의 루트 화면.
    </SlotBox>
  )
}
