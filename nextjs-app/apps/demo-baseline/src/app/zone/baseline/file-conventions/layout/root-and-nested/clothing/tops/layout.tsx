import React from 'react'
import { LayoutFrame } from '../../components/LayoutFrame'

/** 하위 layout: /clothing/tops에만 적용되며 의류 카테고리 layout 안쪽에 들어간다. */
export default function TopsLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutFrame
      file="root-and-nested/clothing/tops/layout.tsx"
      caption="상의 하위 layout (/clothing/tops에만 적용)"
      tone="amber"
    >
      {children}
    </LayoutFrame>
  )
}
