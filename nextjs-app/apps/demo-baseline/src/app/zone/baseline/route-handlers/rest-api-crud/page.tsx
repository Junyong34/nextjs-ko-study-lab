import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RestApiClient } from './components/RestApiClient'

export default function RestApiCrudDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js Route Handler (route.ts) REST API CRUD & NextResponse"
        concept="app/api/.../route.ts에 export async function GET, POST, PATCH, DELETE를 선언하여 NextRequest 파라미터를 파싱하고 표준 NextResponse.json()으로 200/201 상태 코드와 JSON을 반환합니다."
        steps={[
          {
            step: 1,
            title: '[GET 전체 목록 조회] 클릭',
            description: '상단 툴바에서 GET 요청 버튼을 클릭하여 200 OK 응답과 전체 상품 목록 JSON 데이터를 확인합니다.',
            actionBadge: 'GET 조회',
          },
          {
            step: 2,
            title: '[POST 상품 등록 (+1)] 클릭',
            description: 'POST로 새 상품을 추가하고 201 Created 응답과 신규 생성된 ID를 확인합니다.',
            actionBadge: 'POST 등록',
          },
          {
            step: 3,
            title: '[PATCH 1번 상품 품절 처리] 클릭',
            description: 'PATCH 요청을 전송하여 1번 상품의 상태를 품절로 부분 갱신합니다.',
            actionBadge: 'PATCH 갱신',
          },
          {
            step: 4,
            title: '[DELETE 2번 상품 삭제] 및 [목록 초기화] 관찰',
            description: 'DELETE 요청으로 상품을 삭제하고, [목록 초기화]로 기본 2개 항목으로 복구하며 상태 코드를 대조 관찰합니다.',
            actionBadge: 'DELETE 및 복구',
            observe: '각 HTTP 메서드 호출 시 Route Handler가 반환한 상태 코드(200, 201)와 JSON 페이로드가 실시간 수신 및 검증 패널에 대조됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) 및 3단/4단 */}
      <DemoPlaygroundCard title="Next.js RESTful API 인터랙티브 테스터 (/api)" className="space-y-4">
        <RestApiClient />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
