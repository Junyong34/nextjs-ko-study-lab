'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  httpStatus?: number | null
  builderHeader?: string | null
  isSuccess?: boolean
}

export function VerificationFooter({
  httpStatus,
  builderHeader,
  isSuccess,
}: VerificationFooterProps) {
  const isMatched = Boolean(httpStatus !== null && httpStatus !== undefined && builderHeader === 'NextResponse.json')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="NextResponse.json() 빌더 및 헤더 실증 검증"
        expected="• route.ts에서 NextResponse.json(data, init)으로 커스텀 상태 코드와 헤더 주입\n• x-study-response-builder 헤더 및 JSON 본문 일치"
        actual={
          httpStatus
            ? `• [HTTP ${httpStatus}] ${isSuccess ? '성공 응답 생성' : '에러 응답 규격화'} (Header: ${builderHeader || '없음'})\n• NextResponse.json() 빌더 정상 조립 확인`
            : '• NextResponse.json() API 호출 대기 중...'
        }
        isMatched={isMatched}
        description="Next.js App Router의 NextResponse.json() 유틸리티 함수를 통한 표준화된 HTTP 응답 생성 규격을 검증합니다."
      />
            <DemoDeepDiveCard title="NextResponse.json() 표준 API JSON 응답 빌더">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>NextResponse.json()</code> (<code>next/server</code>)은 Web 표준 <code>Response</code>를 확장하여 JSON 응답 객체를 간결하게 생성하는 팩토리 메서드입니다. 상태 코드(<code>status</code>), 응답 헤더(<code>headers</code>), 쿠키(<code>cookies</code>) 설정을 선언적으로 체이닝할 수 있습니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 상품 목록 조회 API(Route Handler)에서 <code>NextResponse.json({'{'} success: true, data: products {'}'}, {'{'} status: 200, headers: {'{'} 'Cache-Control': 's-maxage=60' {'}'} {'}'})</code>를 호출하여 표준 REST 응답과 캐시 헤더를 생성합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>자동 JSON 직렬화 & Content-Type 주입</strong>: <code>JSON.stringify</code>와 <code>Content-Type: application/json</code> 헤더를 자동으로 안전하게 설정합니다.</li>
              <li><strong>유연한 쿠키 설정</strong>: <code>response.cookies.set()</code> 메서드를 통해 응답에 <code>Set-Cookie</code> 헤더를 직관적으로 추가합니다.</li>
              <li><strong>타입 안전한 응답 페이로드</strong>: TypeScript 제네릭을 지원하여 API 응답 데이터 구조의 타입 일관성을 유지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>모바일 앱 및 외부 파트너사 연동 REST API 엔드포인트 응답 구성</li>
              <li>클라이언트 SWR/React Query 페칭용 데이터 API 제공</li>
              <li>에러 발생 시 표준화된 에러 JSON(<code>{'{'} errorCode: 'ERR_01', message: '...' {'}'}</code>) 반환</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>BigInt 직렬화 주의</strong>: <code>NextResponse.json()</code>은 기본 <code>JSON.stringify</code>를 사용하므로 객체에 <code>BigInt</code>나 <code>Date</code> 객체가 포함된 경우 사전 문자열 변환이 필요합니다.</li>
              <li><strong>캐시 헤더 제어</strong>: Route Handler의 GET 메서드는 조건에 따라 기본 캐싱될 수 있으므로 동적 데이터인 경우 <code>Cache-Control: no-store</code>를 명시하는 것이 안전합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
