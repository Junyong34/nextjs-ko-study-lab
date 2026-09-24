'use client'

import { usePathname } from 'next/navigation'
import { CartDrawer } from './CartDrawer'

/**
 * 같은 layout.tsx 위치에 있지만 key가 pathname이다.
 * 카테고리를 옮기면 key가 바뀌므로 React가 이전 인스턴스를 버리고 새로 마운트한다.
 */
export function KeyedCartDrawer() {
  const pathname = usePathname()
  return <CartDrawer key={pathname} slot="keyed" />
}
