'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ShapingPlayground } from './components/ShapingPlayground'
import { VerificationFooter } from './components/VerificationFooter'
import { useShapingRuns } from './hooks/useShapingRuns'
import { FIELD_RULES } from './shaping'

export default function DemoPage() {
  const { results, selected, running, error, run, reset } = useShapingRuns()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Route Handler로 레거시 상품 응답을 모바일 카드용으로 가공 (BFF)"
        concept={`레거시 상품 API는 원가·공급사 계약·감사 로그까지 담은 깊은 JSON을 통째로 돌려줍니다. bff/route.ts가 서버에서 화면에 필요한 ${FIELD_RULES.length}개 필드만 골라 평탄화·이름 변환하고, 입력 검증과 오류 변환까지 맡아 응답 크기와 노출 정보를 함께 줄입니다.`}
        steps={[
          {
            step: 1,
            title: '[P-101]·[P-102]·[P-103] 중 하나 클릭',
            description: '같은 상품을 legacy(원본)와 bff(가공) 경로로 각각 받아 비교표에 채웁니다.',
            actionBadge: '정상 조회',
            observe: '본문 크기(decodedBodySize), 값 개수, 중첩 깊이, 민감 필드 행의 원본 vs BFF 차이',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[P-999 없는 상품] → [abc 형식 오류] 클릭',
            description: '레거시는 둘 다 HTTP 200에 오류 코드·서버 노드·스택을 싣고, BFF는 404/400과 error 한 줄로 바꿉니다.',
            actionBadge: '오류 응답',
            observe: 'HTTP 상태, 민감 필드, 형식 오류일 때 "레거시 호출 안 함"',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '검증 패널에서 판정 확인',
            description: 'DevTools Network 탭에서 legacy·bff 요청의 Size 열과 Response 본문도 같은 값으로 확인할 수 있습니다.',
            actionBadge: '검증',
            observe: '정상 조회 1건 + 오류 2건을 실행한 뒤 "검증 완료" 표시',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="레거시 상품 API 원본 vs BFF 가공 응답 — legacy/route.ts · bff/route.ts">
        <ShapingPlayground
          results={results}
          selected={selected}
          running={running}
          error={error}
          onRun={run}
          onReset={reset}
        />
      </DemoPlaygroundCard>
      <VerificationFooter results={results} />
    </DemoContainer>
  )
}
