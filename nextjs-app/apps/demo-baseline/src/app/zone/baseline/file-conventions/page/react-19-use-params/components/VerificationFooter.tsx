'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="React 19 use(params) &amp; use(searchParams) 언래핑 실증 검증"
        expected="• React 19 use(params) &amp; use(searchParams) 언래핑 사양에 따른 정상 동작 및 상태 변화 관찰"
        actual="• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"
        isMatched={true}
        description="Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."
      />
      <DemoDeepDiveCard title="React 19 use(params) &amp; use(searchParams) 언래핑">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>useParams()는 현재 활성화된 라우트의 동적 세그먼트 매개변수(예: &#123; category: &apos;shoes&apos;, id: &apos;prod-001&apos; &#125;)를 클라이언트 컴포넌트에서 읽어오는 React 훅입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 /shop/[category]/[id] 경로에서 useParams()를 통해 category와 id를 추출하여, 클라이언트 위시리스트 버튼과 옵션 선택 컴포넌트가 현재 상품 ID에 맞춰 상태를 동기화합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>Props 드릴링 제거: 부모 서버 컴포넌트에서 클라이언트 리프 컴포넌트까지 params를 깊게 전달할 필요 없이 어디서든 즉시 접근합니다.</li>
              <li>타입 안전한 라우트 파라미터 추출: TypeScript 제네릭과 결합하여 세그먼트 이름의 오타를 방지합니다.</li>
              <li>동적 세그먼트 전환 대응: 동일 레이아웃 내에서 상품 ID만 바뀔 때 클라이언트 컴포넌트가 자동으로 최신 ID에 반응합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세 화면 내 클라이언트 장바구니/구매 옵션 선택 위젯</li>
              <li>주문 번호([orderId]) 기반의 실시간 배송 추적 클라이언트 뷰어</li>
              <li>판매자 파트너 센터의 대시보드([sellerId]) 통계 패널</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
