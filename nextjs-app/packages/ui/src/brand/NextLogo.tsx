import React from 'react'

export interface NextLogoProps {
  /** 크기와 색은 호출부가 정한다 (헤더 h-4, 푸터 h-3.5) */
  className?: string
}

/** Next.js 삼각형 마크. Header와 Footer가 같은 path를 복붙하고 있었다. */
export function NextLogo({ className = '' }: NextLogoProps) {
  return (
    <svg
      viewBox="0 0 76 65"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  )
}
