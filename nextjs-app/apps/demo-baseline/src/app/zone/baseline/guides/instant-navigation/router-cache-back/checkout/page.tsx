import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/instant-navigation/router-cache-back/checkout')

import React from 'react'
import { DemoContainer } from '@study/demo-kit'
import { NavBackButton } from '../components/NavBackButton'
import { NavTiming } from '../components/NavTiming'

export default function CheckoutPage() {
  return (
    <DemoContainer className="space-y-4">
      <NavTiming />
      <div className="rounded border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
        <div className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">/checkout</div>
        <div className="font-bold text-zinc-900 dark:text-zinc-100">주문서 작성 및 결제</div>
      </div>
      <NavBackButton label="상품 상세" />
    </DemoContainer>
  )
}
