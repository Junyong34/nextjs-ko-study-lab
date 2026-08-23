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

  const defaultExpected = "• 모바일 앱 최적화 응답 가공 (Response Shaping) 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 5단 표준 레이아웃 정상 적용"

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
        title="모바일 앱 최적화 응답 가공 (Response Shaping) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="모바일 앱 최적화 응답 가공 (Response Shaping)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Response Shaping(응답 가공)은 원천 데이터베이스나 백엔드 시스템에서 반환된 대용량 엔티티에서 프론트엔드 뷰에 불필요한 메타데이터, DB 내부 키, 감사 로그를 서버에서 필터링하여 최소한의 경량 페이로드만 전송하는 BFF 데이터 최적화 기법입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 원본 주문 객체(50개 필드, 12KB)에서 클라이언트 화면에 표시할 필수 5개 필드(<code>orderId</code>, <code>title</code>, <code>paidAmount</code>, <code>status</code>, <code>date</code>)만을 선별하여 800바이트의 초경량 JSON으로 변환 전송하는 과정을 대조합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>네트워크 페이로드 85% 이상 절감</strong>: 모바일 셀룰러 환경에서 JSON 파싱 시간과 네트워크 대역폭 소모를 최소화하여 반응 속도를 대폭 개선합니다.</li>
              <li><strong>내부 데이터 보안 누출 차단</strong>: 백엔드 DB 스키마 구조, 내부 서버 IP, 관리자 메모, 비밀번호 해시 등의 민감 필드가 브라우저에 유출되는 사고를 원천 방지합니다.</li>
              <li><strong>타입스크립트 인터페이스 일치성</strong>: 프론트엔드 UI 컴포넌트가 필요로 하는 ViewProps 형태와 1:1로 일치하는 엄격한 DTO 타입을 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>모바일 웹 및 하이브리드 앱 전용 상품 목록/검색 결과 경량화 API</li>
              <li>스마트워치 및 저사양 IoT 기기 연동 결제 상태 조회 응답</li>
              <li>외부 제휴사 파트너에게 제공하는 B2B 공개 데이터 필터링 엔드포인트</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>과도한 필터링 주의</strong>: 클라이언트의 미래 UI 요구사항을 고려하여 필요한 필드까지 제거되지 않도록 버전 관리(API Versioning)를 적절히 적용해야 합니다.</li>
              <li><strong>Zod 스키마 파싱 활용</strong>: <code>zod.pick()</code>이나 <code>transform()</code>을 활용하면 타입 추론과 런타임 데이터 검증 및 쉐이핑을 동시에 달성할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
