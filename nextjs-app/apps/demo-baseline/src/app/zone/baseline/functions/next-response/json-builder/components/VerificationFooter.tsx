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
      <DemoDeepDiveCard title="NextResponse.json() 빌더">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>NextResponse.json(body, init?)</code>은 <code>Response.json()</code> 웹 표준 정적 메서드를 확장한 유틸리티로,
              적절한 <code>Content-Type: application/json</code> 헤더를 자동으로 설정하고 상태 코드 및 커스텀 헤더를 손쉽게 주입할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. Response.json() vs NextResponse.json()</h5>
            <p>
              표준 <code>Response.json()</code>과 기능적으로 유사하지만, <code>NextResponse</code>는 추가적으로 쿠키 조작(<code>response.cookies.set()</code>), 리라이트(<code>NextResponse.rewrite()</code>)와의 체이닝 연계가 용이합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>보일러플레이트 제거: <code>JSON.stringify()</code>와 수동 헤더 설정을 단 한 줄로 단축</li>
              <li>타입 안정성: 제네릭을 통한 반환 데이터 타입 명시 가능</li>
              <li>상태 코드 제어: <code>201 Created</code>, <code>400 Bad Request</code>, <code>422 Unprocessable</code> 등 REST 표준 규격 준수</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>REST API 핸들러에서 DTO 객체를 클라이언트로 직렬화하여 반환할 때</li>
              <li>유효성 검증 실패 시 구조화된 에러 JSON 응답 반환</li>
              <li>인증 토큰 쿠키와 함께 사용자 세션 프로필 JSON 동시 반환</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
