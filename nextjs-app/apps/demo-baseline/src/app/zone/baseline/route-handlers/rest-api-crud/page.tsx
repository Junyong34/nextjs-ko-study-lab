import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RestApiClient } from './components/RestApiClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function RestApiCrudDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="REST API Route Handler (GET, POST, PATCH, DELETE)"
        concept="Route Handler는 app 디렉토리의 route.ts 파일에서 Web 표준 Request/Response 객체와 명시적 HTTP 메서드 export를 통해 강력하고 경량화된 백엔드 REST API 엔드포인트를 구축할 수 있게 해줍니다."
        steps={[
          {
            step: 1,
            title: 'GET 전체 목록 조회',
            description: '파란색 [GET 전체 목록 조회] 버튼을 눌러 현재 상품 목록 JSON을 확인합니다.',
            actionBadge: 'GET 200 OK',
          },
          {
            step: 2,
            title: 'POST 신규 상품 등록',
            description: '초록색 [POST 상품 등록]을 눌러 새 아이템을 등록하고 201 Created 응답을 받습니다.',
            actionBadge: 'POST 201 Created',
          },
          {
            step: 3,
            title: 'PATCH 상태 변경 & DELETE 삭제',
            description: '주황색 [PATCH]와 빨간색 [DELETE]를 차례로 눌러 부분 수정 및 삭제 응답을 검증합니다.',
            actionBadge: 'REST CRUD 완성',
          },
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
