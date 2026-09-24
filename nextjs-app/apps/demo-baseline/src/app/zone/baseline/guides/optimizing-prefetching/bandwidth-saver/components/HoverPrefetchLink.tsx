'use client'

import Link from 'next/link'
import { useState } from 'react'

/**
 * 공식 prefetching 가이드의 "Hover-triggered prefetch" 패턴 그대로.
 * 처음에는 prefetch={false}로 뷰포트 prefetch를 막고, 마우스를 올리면 prefetch={null}(기본 동작)로 되돌린다.
 * onIntent는 이 데모가 hover 수를 세기 위한 관찰용 콜백일 뿐 prefetch 동작에는 관여하지 않는다.
 */
export function HoverPrefetchLink({
  href,
  className,
  onIntent,
  children,
}: {
  href: string
  className?: string
  onIntent?: () => void
  children: React.ReactNode
}) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      className={className}
      prefetch={active ? null : false}
      onMouseEnter={() => {
        setActive(true)
        onIntent?.()
      }}
    >
      {children}
    </Link>
  )
}
