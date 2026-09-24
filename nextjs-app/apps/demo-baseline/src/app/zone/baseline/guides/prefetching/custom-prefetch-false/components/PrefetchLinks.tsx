'use client'

// 공식 가이드(Prefetching)의 세 가지 링크 패턴을 그대로 옮긴 파일이다.
import Link, { type LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type AnchorExtras = { children: React.ReactNode; className?: string; onClick?: () => void }

/** 가이드 "Disabled prefetch": 앱 전체에서 <Link>를 쓰되 이 링크만 prefetch를 끈다. */
export function NoPrefetchLink({ prefetch: _ignored, ...rest }: LinkProps & AnchorExtras) {
  return <Link {...rest} prefetch={false} />
}

/** 가이드 "Hover-triggered prefetch": hover 전에는 false, hover 후에는 null(기본 prefetch)로 바꾼다. */
export function HoverPrefetchLink({ href, children, className, onClick }: { href: string } & AnchorExtras) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
      onClick={onClick}
      className={className}
    >
      {children}
    </Link>
  )
}

/** 가이드 "Manual prefetch": 감싼 영역에 hover하면 router.prefetch()로 직접 예열한다. */
export function RouterPrefetchLink({ href, children, className, onClick }: { href: string } & AnchorExtras) {
  const router = useRouter()

  return (
    <div onMouseEnter={() => router.prefetch(href)}>
      <Link href={href} prefetch={false} onClick={onClick} className={className}>
        {children}
      </Link>
    </div>
  )
}
