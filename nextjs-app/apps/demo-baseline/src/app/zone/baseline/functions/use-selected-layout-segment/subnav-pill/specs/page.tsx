import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'functions/use-selected-layout-segment/subnav-pill/specs',
)

import React from 'react'
import { DEMO_PRODUCT } from '../types'

const SPEC_ROWS = [
  { label: '카테고리', value: DEMO_PRODUCT.categoryName },
  {
    label: '가격',
    value: `${DEMO_PRODUCT.price.toLocaleString()}원 (정가 ${DEMO_PRODUCT.originalPrice.toLocaleString()}원)`,
  },
  { label: '재고', value: `${DEMO_PRODUCT.stock}개` },
  { label: '태그', value: DEMO_PRODUCT.tags.join(', ') },
]

export default function SpecsPage() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="mb-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
        상세 스펙 — /specs (useSelectedLayoutSegment() 반환값: &quot;specs&quot;)
      </p>
      <table className="w-full text-xs">
        <tbody>
          {SPEC_ROWS.map((row) => (
            <tr key={row.label} className="border-t border-zinc-100 dark:border-zinc-800">
              <th className="w-24 py-1.5 text-left font-medium text-zinc-500 dark:text-zinc-400">
                {row.label}
              </th>
              <td className="py-1.5 text-zinc-800 dark:text-zinc-200">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
