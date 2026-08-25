import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RestApiClient } from './components/RestApiClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function RestApiCrudDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js Route Handler (route.ts) REST API CRUD & NextResponse"
        concept="app/api/.../route.ts에 export async function GET, POST, PATCH, DELETE를 선언하여 NextRequest 파라미터를 파싱하고 표준 NextResponse.json()으로 200/201 상태 코드와 JSON을 반환합니다."
        steps={[
          {
                    "step": 1,
                    "title": "[GET 전체 목록 조회] 클릭",
                    "description": "상단 툴바에서 GET 요청 버튼을 클릭하여 200 OK 응답과 전체 상품 목록 JSON 데이터를 확인합니다.",
                    "actionBadge": "GET 조회"
          },
          {
                    "step": 2,
                    "title": "[POST 상품 등록 (+1)] 클릭",
                    "description": "POST로 새 상품을 추가하고 201 Created 응답과 신규 생성된 ID를 확인합니다.",
                    "actionBadge": "POST 등록"
          },
          {
                    "step": 3,
                    "title": "[PATCH 1번 상품 품절 처리] 클릭",
                    "description": "PATCH 요청을 전송하여 1번 상품의 상태를 품절로 부분 갱신합니다.",
                    "actionBadge": "PATCH 갱신"
          },
          {
                    "step": 4,
                    "title": "[DELETE 2번 상품 삭제] 클릭 및 상태 관찰",
                    "description": "DELETE 요청을 전송하여 상품을 삭제하고 HTTP 200/204 상태 코드 및 삭제 결과 페이로드를 대조 관찰합니다.",
                    "actionBadge": "DELETE 삭제",
                    "observe": "각 HTTP 메서드 버튼 클릭 시 200/201 상태 코드와 반환된 JSON 페이로드가 즉시 표시됨",
                    "observeAt": "playground"
          }
]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="Next.js RESTful API 인터랙티브 테스터 (/api)" className="space-y-4">
        <RestApiClient />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
