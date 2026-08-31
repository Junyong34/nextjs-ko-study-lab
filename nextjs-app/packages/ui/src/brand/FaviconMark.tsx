import React from 'react'

export interface FaviconMarkProps {
  /** 크기는 호출부가 정한다 */
  className?: string
}

/**
 * 셸 파비콘(`apps/shell/src/app/icon.svg`)과 동일한 책+코드 마크입니다.
 * 이 저장소의 브랜드 아이콘을 재사용해야 하는 자리(책 표지 스탬프 등)에 쓴다.
 */
export function FaviconMark({ className = '' }: FaviconMarkProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="60" height="60" rx="14" fill="#09090B" />
      <g fill="#FFFFFF">
        <path d="M10.5 15.5c8.2 0 15.2 2.4 20.7 7v30c-5.6-4.1-12.5-6.1-20.7-6.1V15.5Z" />
        <path d="M53.5 15.5c-8.2 0-15.2 2.4-20.7 7v30c5.6-4.1 12.5-6.1 20.7-6.1V15.5Z" />
      </g>
      <g fill="none" stroke="#09090B" strokeLinecap="round">
        <path d="M15.5 33h10.5" strokeWidth="3" />
        <g strokeLinejoin="round" strokeWidth="3">
          <path d="m40 29.5-3.5 3.5 3.5 3.5M46.5 29.5 50 33l-3.5 3.5M44.5 28.5l-3 9" />
        </g>
      </g>
    </svg>
  )
}
