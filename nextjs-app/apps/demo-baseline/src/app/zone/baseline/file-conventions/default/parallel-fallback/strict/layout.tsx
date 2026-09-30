import type { ReactNode } from 'react'

export default function StrictLayout({ children, side }: { children: ReactNode; side: ReactNode }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {children}
      {side}
    </div>
  )
}
