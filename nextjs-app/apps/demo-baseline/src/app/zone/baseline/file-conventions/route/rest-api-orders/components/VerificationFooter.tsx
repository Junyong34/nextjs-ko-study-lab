'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { DemoStatus } from '../types'

interface VerificationFooterProps {
  status: DemoStatus
}

/**
 * 지금 막 실행된 액션(GET/유효한 POST/잘못된 POST) 기준으로 기대 상태 코드와
 * 실제 상태 코드를 대조한다. GET만으로는 절대 "검증 완료"가 되지 않는다 —
 * 먼저 POST로 주문을 만든 뒤 그 주문이 실제 GET 응답에 나타나야만 매치된다.
 */
function evaluate(status: DemoStatus): { isMatched: boolean | undefined; expected: string; actual: string } {
  const { lastAction, httpStatus, expectedStatus, orderCount, createdOrderId, createdOrderVisible } = status

  if (lastAction === null || httpStatus === null) {
    return {
      isMatched: undefined,
      expected: '• [POST 주문 전송]으로 주문 생성 → [GET 목록 새로고침]으로 반영 확인',
      actual: '• 아직 요청을 보내지 않았습니다.',
    }
  }

  if (lastAction === 'post-invalid') {
    return {
      isMatched: httpStatus === expectedStatus,
      expected: `• route.ts POST 핸들러가 존재하지 않는 상품 ID를 ${expectedStatus} Bad Request로 거부해야 함`,
      actual: `• [HTTP ${httpStatus}] 실제 응답 수신 — 잘못된 상품 ID가 ${httpStatus === expectedStatus ? '정상적으로 거부됨' : '거부되지 않음(버그)'}`,
    }
  }

  if (lastAction === 'post-valid') {
    return {
      isMatched: httpStatus === expectedStatus ? undefined : false,
      expected: `• route.ts POST 핸들러가 유효한 주문을 ${expectedStatus} Created로 생성해야 함`,
      actual: `• [HTTP ${httpStatus}] 주문 ${createdOrderId} 생성 응답 수신 — GET으로 목록 반영 여부 확인 필요`,
    }
  }

  // lastAction === 'get'
  if (!createdOrderId) {
    return {
      isMatched: undefined,
      expected: `• route.ts GET 핸들러가 ${expectedStatus} OK로 현재 주문 목록을 반환해야 함`,
      actual: `• [HTTP ${httpStatus}] 초기 주문 ${orderCount}건 조회됨 — 아직 POST 테스트를 수행하지 않음`,
    }
  }

  return {
    isMatched: httpStatus === expectedStatus && createdOrderVisible,
    expected: `• route.ts GET 핸들러가 ${expectedStatus} OK와 함께 방금 만든 주문(${createdOrderId})을 포함해야 함`,
    actual: `• [HTTP ${httpStatus}] 주문 ${orderCount}건 중 ${createdOrderId}가 ${createdOrderVisible ? '목록에서 확인됨' : '아직 목록에 없음'}`,
  }
}

export function VerificationFooter({ status }: VerificationFooterProps) {
  const { isMatched, expected, actual } = evaluate(status)

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="REST GET/POST 주문 API (route.ts) 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="Next.js App Router의 route.ts 파일 규칙으로 만든 엔드포인트와 실제 HTTP 통신 결과를 확인합니다."
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
              본 데모에서는 <code>GET</code> 함수가 호출되면 저장된 주문 목록 배열을 <code>NextResponse.json()</code>으로 200 OK 반환하고, <code>POST</code> 함수는 전송된 JSON 페이로드를 파싱하여 새로운 주문을 생성한 후 <code>201 Created</code> 상태 코드 및 생성된 주문 객체를 즉시 반환합니다. 존재하지 않는 상품 ID로 POST하면 <code>400 Bad Request</code>를 반환합니다. 화면의 주문 목록은 POST 응답이 아니라 GET을 다시 호출했을 때만 갱신되는데, 이는 브라우저 상태와 서버 상태가 별개이며 REST API는 재조회(GET)를 통해서만 최신 서버 상태를 알 수 있음을 보여줍니다.
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
              <li><strong>기본 캐싱 동작(Next.js 16 기준)</strong>: Route Handler는 기본적으로 캐시되지 않고 매 요청마다 실행됩니다. 반대로 <code>GET</code> 핸들러 응답을 빌드 시점에 캐시하고 싶다면 <code>export const dynamic = &apos;force-static&apos;</code>을 명시적으로 선언해야 합니다 — 과거(15 이전) 버전의 &quot;기본 정적 캐싱&quot; 동작과 반대이므로 구버전 자료를 참고할 때 주의가 필요합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
