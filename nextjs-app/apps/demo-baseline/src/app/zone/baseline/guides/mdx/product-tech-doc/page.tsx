import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import * as specModule from './content/spec.mdx'
import { TechDocLab } from './components/TechDocLab'
import type { SpecMeta } from './types'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/mdx/product-tech-doc')

// @types/mdx는 *.mdx 모듈에 default export만 선언한다. MDX 파일이 실제로 내보내는 specMeta의 타입을 여기서 알려 준다.
const { default: Spec, specMeta } = specModule as typeof specModule & { specMeta: SpecMeta }

// 서버 컴포넌트에서 .mdx를 컴포넌트로 import해 렌더한다. MDX는 서버에서 HTML이 되어 클라이언트 측정 영역(children)으로 들어간다.
export default function DemoPage() {
  return (
    <TechDocLab meta={specMeta}>
      <Spec />
    </TechDocLab>
  )
}
