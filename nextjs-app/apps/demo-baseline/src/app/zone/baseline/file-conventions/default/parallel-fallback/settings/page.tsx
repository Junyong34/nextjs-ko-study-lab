import { SlotBox } from '../components/SlotBox'

export default function Page() {
  return (
    <SlotBox slot="children" screen="settings" file="parallel-fallback/settings/page.tsx" title="설정 (children)">
      URL <code>/settings</code>. 이 세그먼트는 children에만 있고 @cart, @promo에는 없다.
    </SlotBox>
  )
}
