import type { Metadata } from 'next'
import type { MDXComponents } from 'mdx/types'
import { getDemoMetadata } from '@study/demos'
import Sample from './content/sample.mdx'
import { ThemeLab } from './components/ThemeLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/mdx-components/global-mdx-theme')

// 전역 매핑을 끈 렌더: 같은 키를 문자열 태그로 덮어써 기본 HTML 요소로 되돌린다(components prop이 전역보다 우선).
const RAW_TAGS = { h1: 'h1', h2: 'h2', p: 'p', a: 'a', code: 'code' } satisfies MDXComponents

// 같은 sample.mdx를 두 번 렌더한다. 하나는 src/mdx-components.tsx의 전역 매핑 그대로, 하나는 매핑을 되돌린 상태.
export default function DemoPage() {
  return <ThemeLab raw={<Sample components={RAW_TAGS} />} mapped={<Sample />} />
}
