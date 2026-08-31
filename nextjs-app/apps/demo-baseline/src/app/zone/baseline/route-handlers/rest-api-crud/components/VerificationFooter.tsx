'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  lastMethod?: string
  lastStatus?: string
  lastUrl?: string
  responseSummary?: string
  hasInteracted?: boolean
}

export function VerificationFooter({
  lastMethod = '',
  lastStatus = '',
  lastUrl = '',
  responseSummary = '',
  hasInteracted = false,
}: VerificationFooterProps) {
  const isSuccess = lastStatus.startsWith('2')
  const isMatched = hasInteracted ? isSuccess : undefined

  const expected =
    '• route.ts HTTP 메서드(GET/POST/PATCH/DELETE)별 NextResponse.json() 표준 응답\n• 상태 코드: GET/PATCH/DELETE 200 OK, POST 201 Created (RESTful 규격)\n• JSON 페이로드 반환 및 클라이언트 실시간 상태 동기화'

  const actual = !hasInteracted
    ? '• API 호출 대기 중 (상단 툴바에서 GET/POST/PATCH/DELETE 버튼을 클릭하세요)'
    : `• 최근 호출: ${lastMethod} ${lastUrl}\n• 수신 상태 코드: ${lastStatus}\n• 응답 요약: ${responseSummary}`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="REST API Route Handler (GET, POST, PATCH, DELETE) 실증 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="Next.js App Router route.ts의 Web 표준 HTTP 메서드 핸들러 및 NextResponse.json() 동작을 실시간 검증합니다."
      />
      <DemoDeepDiveCard title="REST API Route Handler (GET, POST, PATCH, DELETE)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>app/api/.../route.ts</code> 파일 컨벤션은 Web 표준 <code>Request</code> 및 <code>Response</code> 객체를 기반으로 HTTP 메서드(<code>GET</code>, <code>POST</code>, <code>PATCH</code>, <code>DELETE</code>)를 명시적으로 export하여 RESTful API 엔드포인트를 구축하는 App Router 표준 서버리스 API 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 상품 리소스에 대해 <code>GET</code>(목록/단건 조회), <code>POST</code>(신규 등록), <code>PATCH</code>(재고/가격 부분 수정), <code>DELETE</code>(삭제), <code>초기화</code> 요청을 전송하고, <code>NextResponse.json()</code>을 통한 상태 코드(200, 201) 및 JSON 응답 반환 과정을 실시간으로 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Web 표준 기반 아키텍처</strong>: Node.js 고유의 <code>req/res</code>가 아닌 표준 Web Fetch API 인터페이스를 사용하여 Edge/Node.js 어디서나 이식 가능합니다.</li>
              <li><strong>정밀한 HTTP 상태 코드 및 헤더 제어</strong>: 201 Created, 204 No Content, Cache-Control 등 완벽한 REST 표준 응답 규격을 준수합니다.</li>
              <li><strong>모바일 앱 및 외부 연동 지원</strong>: 웹 브라우저 외에 iOS/Android 네이티브 앱이나 서드파티 웹훅을 위한 범용 API를 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>모바일 앱 전용 상품 목록 및 주문 생성 REST API 엔드포인트</li>
              <li>결제 대행사(PG) 결제 완료 웹훅(Webhook) 수신 및 DB 트랜잭션 처리</li>
              <li>관리자 ERP 시스템 연동을 위한 대량 상품 재고 동기화 인터페이스</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>GET 요청 캐싱 주의</strong>: 파라미터나 <code>cookies()</code>, <code>headers()</code>를 사용하지 않는 <code>GET</code> 핸들러는 기본적으로 정적 캐싱될 수 있으므로, 항상 동적 데이터가 필요하다면 <code>export const dynamic = 'force-dynamic'</code>을 선언해야 합니다.</li>
              <li><strong>Request Body 1회 소비</strong>: <code>req.json()</code>이나 <code>req.text()</code>는 스트림이므로 1회만 읽을 수 있습니다. 다중 검증이 필요한 경우 변수에 결과를 저장해 재사용해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
