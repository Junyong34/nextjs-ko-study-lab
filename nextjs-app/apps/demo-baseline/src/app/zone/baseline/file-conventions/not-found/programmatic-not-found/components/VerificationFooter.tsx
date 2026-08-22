'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="notFound() 프로그래밍 트리거 실증 검증"
        expected="• notFound() 프로그래밍 트리거 사양에 따른 정상 동작 및 상태 변화 관찰"
        actual="• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"
        isMatched={true}
        description="Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."
      />
      <DemoDeepDiveCard title="notFound() 프로그래밍 트리거">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>notFound(), forbidden(), unauthorized() 함수는 서버 컴포넌트나 Route Handler에서 특정 상태 코드(404, 403, 401)를 트리거하여 대응하는 특수 파일(not-found.tsx, forbidden.tsx, unauthorized.tsx)을 즉각 렌더링하는 표준 에러 바운더리 API입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 존재하지 않거나 단종된 상품 ID 접근 시 notFound()를 호출하여 맞춤형 404 안내 화면을 띄우고, 일반 고객이 판매자 정산 센터에 접근하면 forbidden()을 호출하여 403 권한 거부 화면을 렌더링합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>화면 전체 크래시 방지: 상위 GNB와 레이아웃은 정상 유지하면서 메인 콘텐츠 영역에만 친절한 안내 화면을 렌더링합니다.</li>
              <li>정확한 HTTP 상태 코드 응답: 검색엔진 크롤러에게 올바른 404/403 상태 코드를 반환하여 색인 오염을 방지합니다.</li>
              <li>선언적 예외 처리: 복잡한 조건부 if/else JSX 분기 대신 함수 호출 하나로 표준 에러 화면을 바인딩합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>삭제되거나 품절 후 비공개 처리된 상품 상세 페이지의 404 안내 화면</li>
              <li>일반 회원이 판매자 전용 재고 관리 대시보드 접근 시 403 권한 차단</li>
              <li>비로그인 사용자가 주문 취소/환불 신청서 접근 시 401 로그인 요구</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
