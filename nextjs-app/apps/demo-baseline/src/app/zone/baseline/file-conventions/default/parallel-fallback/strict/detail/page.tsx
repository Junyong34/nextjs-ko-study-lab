import { SlotBox } from '../../components/SlotBox'

export default function Page() {
  return (
    <SlotBox slot="children" screen="strict-detail" file="strict/detail/page.tsx" title="주문 상세 (strict/children)">
      URL <code>/strict/detail</code>. <code>@side</code>에는 <code>detail</code> 하위 페이지가 없다.
    </SlotBox>
  )
}
