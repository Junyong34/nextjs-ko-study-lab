import React from 'react'
import { StyledBadge } from './StyledBadge'

/**
 * 같은 tone(sale)을 3번 쓰고 다른 tone(new)을 1번 쓴다.
 * registry가 dedupe하면 사용 요소는 4개, 규칙은 2개만 SSR HTML에 실려야 한다.
 */
export function ProductShelf() {
  return (
    <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
      <li className="flex items-center gap-2"><StyledBadge tone="sale">SALE</StyledBadge>겨울 러닝화</li>
      <li className="flex items-center gap-2"><StyledBadge tone="sale">SALE</StyledBadge>방수 재킷</li>
      <li className="flex items-center gap-2"><StyledBadge tone="sale">SALE</StyledBadge>보온 장갑</li>
      <li className="flex items-center gap-2"><StyledBadge tone="new">NEW</StyledBadge>트레킹 폴</li>
    </ul>
  )
}
