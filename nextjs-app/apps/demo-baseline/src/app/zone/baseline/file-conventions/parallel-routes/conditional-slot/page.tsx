import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/parallel-routes/conditional-slot')

// 화면은 layout.tsx가 조립한다. 이 page는 children 슬롯의 내용이 없다.
export default function DemoPage() {
  return null
}
