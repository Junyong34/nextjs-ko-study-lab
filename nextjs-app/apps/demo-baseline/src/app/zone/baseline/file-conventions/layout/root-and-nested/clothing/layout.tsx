import React from 'react'
import { LayoutFrame } from '../components/LayoutFrame'

/** 카테고리 layout: /clothing과 그 아래(/clothing/tops, /clothing/bottoms) 경로에만 적용된다. */
export default function ClothingLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutFrame
      file="root-and-nested/clothing/layout.tsx"
      caption="의류 카테고리 layout (/clothing 이하에만 적용)"
      tone="blue"
    >
      {children}
    </LayoutFrame>
  )
}
