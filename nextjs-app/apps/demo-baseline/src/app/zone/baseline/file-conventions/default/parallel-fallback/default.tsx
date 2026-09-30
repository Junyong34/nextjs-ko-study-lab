import { SlotBox } from './components/SlotBox'

export default function Default() {
  return (
    <SlotBox slot="children" screen="default" file="parallel-fallback/default.tsx" title="상품 영역 폴백 (children)">
      children은 암시적 슬롯이라 이 라우트에서 활성 상태를 복구하지 못할 때를 위해 default.tsx가 필요하다.
    </SlotBox>
  )
}
