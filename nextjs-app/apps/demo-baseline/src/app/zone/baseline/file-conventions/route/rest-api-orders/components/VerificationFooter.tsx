'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  httpStatus?: number | null
  orderCount?: number
  lastMethod?: string
}

export function VerificationFooter({
  httpStatus,
  orderCount = 0,
  lastMethod = 'GET',
}: VerificationFooterProps) {
  const isMatched = Boolean(httpStatus && (httpStatus === 200 || httpStatus === 201) && orderCount > 0)

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="REST GET/POST 주문 API (route.ts) 실증 검증"
        expected="• Next.js App Router route.ts에서 GET(200 OK) 및 POST(201 Created) 응답 처리\n• 주문 수명 주기(Order Lifecycle) 동기화 완료"
        actual={
          httpStatus
            ? `• [HTTP ${httpStatus}] ${lastMethod} 요청 성공 (주문 ${orderCount}건 확인)\n• route.ts 실제 엔드포인트 응답 감지`
            : '• route.ts 요청 대기 중...'
        }
        isMatched={isMatched}
        description="Next.js App Router 공식 표준 스펙에 따라 route.ts 파일 컨벤션이 생성한 엔드포인트와의 실제 HTTP 통신 결과를 대조 검증합니다."
      />
      <DemoDeepDiveCard title="REST GET/POST 주문 API (route.ts) 및 HTTP 메서드 핸들러">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>route.ts</code>는 App Router에서 특정 URL 경로에 대한 웹 표준 <code>Request</code>/<code>Response</code> 기반 HTTP 엔드포인트를 선언하는 파일 컨벤션입니다. 동일 디렉토리에 <code>page.tsx</code>가 없더라도 독립적인 REST API 역할을 수행하며, <code>GET</code>, <code>POST</code>, <code>PATCH</code>, <code>DELETE</code> 등 개별 메서드 핸들러를 export합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>GET</code> 함수가 호출되면 저장된 주문 목록 배열을 <code>NextResponse.json()</code>으로 200 OK 반환하고, <code>POST</code> 함수는 전송된 JSON 페이로드를 파싱하여 새로운 주문을 생성한 후 <code>201 Created</code> 상태 코드 및 생성된 주문 객체를 즉시 반환합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>웹 표준 Request/Response 완벽 호환</strong>: Web Fetch API 표준 기반으로 동작하여 모바일 앱, 서드파티, 마이크로서비스 간 높은 상호운용성을 제공합니다.</li>
              <li><strong>깔끔한 HTTP 메서드 라우팅</strong>: 별도의 라우팅 라이브러리(Express 등) 없이 함수명 정의만으로 메서드 분기를 직관적으로 처리합니다.</li>
              <li><strong>NextResponse 유틸리티 지원</strong>: JSON 직렬화, 쿠키 주입, 리라이트, 커스텀 헤더 설정을 간결하게 구현합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>모바일 앱이나 외부 서비스와의 통신을 위한 공용 REST API 제공</li>
              <li>PG사 결제 웹훅 수신 및 타사 연동 데이터 수신</li>
              <li>파일 다운로드, 스트리밍(SSE), 이미지 동적 생성 등 바이너리 및 특수 포맷 응답</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>동일 경로 page.tsx와의 충돌 주의</strong>: 동일 디렉토리 내에 <code>page.tsx</code>와 <code>route.ts</code>가 동시에 존재할 수 없습니다(라우트 충돌 발생). API는 통상 <code>app/api/...</code> 하위 경로로 분리해야 합니다.</li>
              <li><strong>Request Caching 규칙</strong>: <code>GET</code> 메서드 핸들러에서 <code>Request</code> 객체를 읽거나 동적 함수를 호출하지 않으면 기본적으로 빌드 시 정적 캐싱될 수 있으므로, 실시간 데이터가 필요한 경우 <code>export const dynamic = 'force-dynamic'</code>을 선언해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
