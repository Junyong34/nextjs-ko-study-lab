import { SlotBox } from '../components/SlotBox'

export default function Page() {
  return (
    <SlotBox slot="children" screen="strict-home" file="strict/page.tsx" title="주문 목록 (strict/children)">
      URL <code>/strict</code>. 이 하위 트리의 <code>@side</code> 슬롯은 <code>default.tsx</code>에서 <code>notFound()</code>를 호출한다.
    </SlotBox>
  )
}
