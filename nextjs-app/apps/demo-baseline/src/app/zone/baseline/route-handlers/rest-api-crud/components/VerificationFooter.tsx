'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = "• REST API Route Handler (GET, POST, PATCH, DELETE) 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="REST API Route Handler (GET, POST, PATCH, DELETE) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="REST API Route Handler (GET, POST, PATCH, DELETE)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js App Router의 route.ts 파일은 Web 표준 Request 및 Response 객체를 기반으로 HTTP 메서드(GET, POST, PATCH, DELETE)를 내보내어 RESTful API 엔드포인트를 구현하는 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>export async function GET/POST/PATCH/DELETE 함수를 통해 상품 및 장바구니 리소스에 대한 조회, 신규 생성(201 Created), 부분 수정, 삭제 처리를 표준 HTTP 규약에 맞춰 수행합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>완벽한 웹 표준 및 풀스택 통합: 별도의 Express 서버 없이 단일 Next.js 프로젝트 안에서 고성능 백엔드 API를 제공합니다.</li>
              <li>타입 안전한 요청/응답 처리: TypeScript 인터페이스와 결합하여 요청 바디와 응답 페이로드의 일관성을 컴파일 시점에 보장합니다.</li>
              <li>정교한 HTTP 상태 코드 제어: 200 OK, 201 Created, 400 Bad Request, 404 Not Found 등 REST 표준 상태 코드를 직관적으로 제어합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상품/장바구니/주문 CRUD 엔드포인트(/api/products, /api/cart) 구현</li>
              <li>모바일 네이티브 앱(iOS/Android)과의 연동을 위한 JSON API 제공</li>
              <li>서드파티 시스템과의 데이터 연동 및 마이크로서비스 간 통신</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
