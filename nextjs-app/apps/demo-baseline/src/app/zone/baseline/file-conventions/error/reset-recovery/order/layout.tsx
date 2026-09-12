import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer } from '@study/demo-kit'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/error/reset-recovery/order')

/**
 * error.tsx는 같은 세그먼트의 page.tsx만 대체하고, 상위 layout.tsx는 유지한다.
 * 그래서 이 DemoContainer는 성공 화면과 에러 화면 양쪽에서 그대로 유지된다.
 */
export default function OrderLayout({ children }: { children: ReactNode }) {
  return <DemoContainer className="space-y-4">{children}</DemoContainer>
}
