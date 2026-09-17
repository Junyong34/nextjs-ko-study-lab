'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { FALLBACK_STATUS_CODE, VALID_STATUS_CODES } from '../types'
import type { JsonBuilderResponseState } from '../types'

type VerificationFooterProps = Partial<JsonBuilderResponseState>

function resolveExpectedStatus(requestedStatus: number): number {
  return (VALID_STATUS_CODES as readonly number[]).includes(requestedStatus)
    ? requestedStatus
    : FALLBACK_STATUS_CODE
}

export function VerificationFooter({
  requestedStatus,
  httpStatus,
  builderHeader,
  authHeader,
}: VerificationFooterProps) {
  const hasRequested = requestedStatus !== null && requestedStatus !== undefined
  const expectedStatus = hasRequested ? resolveExpectedStatus(requestedStatus!) : null
  const isWhitelisted = hasRequested && (VALID_STATUS_CODES as readonly number[]).includes(requestedStatus!)
  const headersOk = builderHeader === 'NextResponse.json' && authHeader === 'bearer-token-verified'
  const isMatched = hasRequested ? httpStatus === expectedStatus && headersOk : undefined

  const expected = !hasRequested
    ? '요청 대기 중'
    : isWhitelisted
      ? `HTTP ${expectedStatus} 그대로 반환 + x-study-response-builder / x-custom-header-auth 헤더 포함`
      : `요청값 ${requestedStatus}은 화이트리스트에 없어 서버가 기본값 HTTP ${expectedStatus}로 대체 + 커스텀 헤더는 그대로 포함`

  const actual = httpStatus === null || httpStatus === undefined
    ? '응답 수신 대기 중'
    : `HTTP ${httpStatus} 반환 (builder 헤더: ${builderHeader || '없음'}, auth 헤더: ${authHeader || '없음'})`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="NextResponse.json() 빌더 및 헤더 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="클라이언트가 요청한 상태 코드가 route.ts의 화이트리스트 검증을 거쳐 NextResponse.json()의 실제 상태 코드·헤더로 정확히 반영되는지 검증합니다."
      />
      <DemoDeepDiveCard title="NextResponse.json() 표준 API JSON 응답 빌더">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>NextResponse.json(body, init)</code> (<code>next/server</code>)은 Web 표준 <code>Response</code>를 확장한 정적 메서드로, 내부적으로 <code>Response.json(body, init)</code>을 그대로 호출한 뒤 <code>NextResponse</code>로 감쌉니다. <code>init.status</code>로 HTTP 상태 코드를, <code>init.headers</code>로 커스텀 응답 헤더를 선언적으로 주입할 수 있습니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모의 <code>api/route.ts</code>는 <code>NextResponse.json(payload, {'{'} status: validStatus, headers: {'{'} 'x-study-response-builder': 'NextResponse.json', 'x-custom-header-auth': 'bearer-token-verified' {'}'} {'}'})</code>를 호출합니다. <code>validStatus</code>는 화이트리스트(<code>200/201/400/404/422/500</code>)에 있는 값만 그대로 쓰고, 그 외 값은 200으로 대체됩니다 — 상태 코드는 클라이언트가 아니라 서버 코드가 최종 결정합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>자동 JSON 직렬화 & Content-Type 주입</strong>: <code>JSON.stringify</code>와 <code>Content-Type: application/json</code> 헤더를 자동으로 설정하므로, 이 데모처럼 <code>init.headers</code>에 <code>content-type</code>을 따로 넣을 필요가 없습니다.</li>
              <li><strong>유연한 쿠키 설정</strong>: <code>response.cookies.set()</code> 메서드를 통해 응답에 <code>Set-Cookie</code> 헤더를 직관적으로 추가합니다.</li>
              <li><strong>타입 안전한 응답 페이로드</strong>: <code>json&lt;JsonBody&gt;(body, init): NextResponse&lt;JsonBody&gt;</code> 제네릭 시그니처를 지원하여 API 응답 데이터 구조의 타입 일관성을 유지합니다.</li>
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
              <li><strong>클라이언트 입력을 상태 코드로 그대로 신뢰하지 않기</strong>: 이 데모의 <code>999</code> 요청 버튼처럼, 상태 코드를 요청 파라미터 등 클라이언트 입력에서 가져온다면 반드시 화이트리스트로 검증한 뒤 <code>NextResponse.json()</code>에 넘겨야 합니다.</li>
              <li><strong>BigInt 직렬화 주의</strong>: <code>NextResponse.json()</code>은 기본 <code>JSON.stringify</code>를 사용하므로 객체에 <code>BigInt</code>나 <code>Date</code> 객체가 포함된 경우 사전 문자열 변환이 필요합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
