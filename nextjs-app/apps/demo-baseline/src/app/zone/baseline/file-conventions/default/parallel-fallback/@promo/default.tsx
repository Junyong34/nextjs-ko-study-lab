import { SlotBox } from '../components/SlotBox'

export default function Default() {
  return (
    <SlotBox slot="promo" screen="default" file="@promo/default.tsx" title="기본 기획전 폴백 (@promo)">
      새로고침처럼 슬롯의 이전 상태를 알 수 없을 때, URL과 매칭되지 않는 <code>@promo</code> 자리에 <code>default.tsx</code>가 렌더링됐다.
    </SlotBox>
  )
}
