'use client'
import type { ReactNode } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import type { SpecMeta } from '../types'
import { useTechDocProbe } from '../hooks/useTechDocProbe'
import { TechDocPlayground } from './TechDocPlayground'
import { VerificationFooter } from './VerificationFooter'

export function TechDocLab({ meta, children }: { meta: SpecMeta; children: ReactNode }) {
  const s = useTechDocProbe()
  return (
    <DemoContainer className="space-y-4">
      <DemoGuideCard
        title="상품 기술 문서를 .mdx 파일로 렌더링"
        concept="MDX 파일은 빌드 도구가 React 컴포넌트로 컴파일한다. page.tsx에서 import하면 컴포넌트로, page.mdx로 두면 그 자체가 라우트가 된다. 마크다운 문법이 실제로 어떤 HTML 요소가 됐는지 DOM에서 세어 본다."
        steps={[
          { step: 1, title: '예측: 파이프 표는 <table>이 될까?', description: '문서의 "사이즈 정보"에는 GFM 표 문법(| --- |)과 JSX <table>이 함께 있습니다. 파이프 표가 표가 될지 예측합니다.', actionBadge: '예측' },
          { step: 2, title: '[렌더된 DOM 측정]', description: 'content/spec.mdx를 import해 렌더한 영역에서 h1·h2·p·목록·인용·코드·링크·표 요소를 셉니다.', actionBadge: 'DOM 측정', observe: '태그별 기대 개수와 실측 개수', observeAt: 'playground' },
          { step: 3, title: '[page.mdx 라우트 요청]', description: '같은 문서를 렌더하는 spec-sheet/page.mdx를 GET으로 요청해 상태 코드, <title>(MDX의 export const metadata), <h1>을 읽습니다.', actionBadge: '라우트 요청', observe: '200 응답과 title', observeAt: 'playground' },
          { step: 4, title: '검증 패널 확인', description: '태그 개수, 표 한계, 예측, 라우트 응답을 함께 판정합니다.', actionBadge: '결과 확인', observe: '항목별 ✅/❌', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="content/spec.mdx → page.tsx import 렌더 / spec-sheet/page.mdx 라우트">
        <TechDocPlayground meta={meta} probe={s}>
          {children}
        </TechDocPlayground>
      </DemoPlaygroundCard>
      <VerificationFooter census={s.census} route={s.route} prediction={s.prediction} />
    </DemoContainer>
  )
}
