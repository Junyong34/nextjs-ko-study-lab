import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/mdx/product-tech-doc')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MdxTechDocDemo } from './components/MdxTechDocDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"MDX 컴파일 및 기술 문서 렌더링 파이프라인"}
        concept={"@next/mdx 패키지를 통해 마크다운(.mdx) 파일을 React 컴포넌트로 컴파일하여, 풍부한 이커머스 상품 사양 기술 문서를 서버 사이드(SSG/RSC)에서 정적 HTML로 렌더링합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택",
            description: "MDX 문서가 연동된 상품 카탈로그에서 기술 문서를 열람할 품목을 선택합니다.",
            actionBadge: "품목 선택",
          },
          {
            step: 2,
            title: "[+] 또는 [-] 버튼으로 수량 조작",
            description: "문서 하단에 연동된 상품 주문 옵션 상태를 변경합니다.",
            actionBadge: "수량 변경",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 MDX 연동 API 호출",
            description: "MDX 본문과 결합된 비즈니스 동기화 액션을 실행합니다.",
            actionBadge: "동작 실행",
          },
          {
            step: 4,
            title: "MDX 마크다운 구문 분석 및 리치 텍스트 렌더링 관찰",
            description: "헤딩, 코드 블록, 테이블 등 마크다운 구문이 스타일 적용된 HTML로 깔끔하게 렌더링되는지 확인합니다.",
            actionBadge: "MDX 렌더링 검증",
            observe: "MDX 파일의 컴파일된 HTML 구조와 상품 스펙 문서 및 동기화 로그 렌더링 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"상품 기술 문서 MDX 렌더링 실습"}>
        <MdxTechDocDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
