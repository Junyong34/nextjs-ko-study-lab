import type { ReactNode } from 'react'
import { PracticeFrame } from './components/PracticeFrame'

export default function Layout({
  children,
  cart,
  promo,
}: {
  children: ReactNode
  cart: ReactNode
  promo: ReactNode
}) {
  return (
    <PracticeFrame cart={cart} promo={promo}>
      {children}
    </PracticeFrame>
  )
}
