import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SingleParamDemo } from './components/SingleParamDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"[id] 단일 동적 세그먼트 파라미터 매핑"}
        concept={"products/[id]/page.tsx는 URL 경로의 가변 세그먼트(PROD-001, PROD-002)를 params.id로 캡처하여 상품별 고유 상세 화면을 동적으로 렌더링합니다."}
        steps={[
        {
        "step": 1,
        "title": "[상세 보기 →] 링크 클릭",
        "description": "특정 상품 카드에서 [id] 동적 세그먼트 상세 라우트로 진입합니다.",
        "actionBadge": "[id] 이동"
        },
        {
        "step": 2,
        "title": "파라미터 추출 및 상품 상세 렌더링 확인",
        "description": "서버 컴포넌트가 params.id를 읽어 해당 상품(PROD-001)의 상세 정보와 가격을 렌더링합니다.",
        "actionBadge": "params.id"
        },
        {
        "step": 3,
        "title": "[← 상품 목록으로 복귀] 클릭",
        "description": "목록 화면으로 돌아와 다른 동적 파라미터(PROD-002) 진입 시에도 동일한 [id] 템플릿이 재사용되는지 확인합니다.",
        "actionBadge": "목록 복귀",
        "observe": "URL의 [id] 세그먼트와 페이지에 렌더링된 상품 ID 및 3단 검증 패널의 파라미터 바인딩 일치 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"[id] 단일 동적 세그먼트 실습"}>
        <SingleParamDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
