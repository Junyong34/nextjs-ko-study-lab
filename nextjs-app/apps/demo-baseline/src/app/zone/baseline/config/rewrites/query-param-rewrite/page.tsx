import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { RewriteLab } from './components/RewriteLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/rewrites/query-param-rewrite')

// /old, /legacy/*, /products/*, /lookup 은 이 폴더가 아니라 next.config의 rewrites()와 하위 목적지 page가 처리한다.
export default function DemoPage() {
  return <RewriteLab />
}
