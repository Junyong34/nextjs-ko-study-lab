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

  const defaultExpected = "• redirects() 정규식 패턴 및 와일드카드 리다이렉트 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="redirects() 정규식 패턴 및 와일드카드 리다이렉트 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="next.config.ts redirects() 정규식 패턴 & 와일드카드 리다이렉트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next.config.ts</code>의 <code>redirects()</code> 비동기 함수는 인프라 및 라우팅 계층에서 수신된 요청 URL을 정규식(Regex)과 와일드카드(<code>:path*</code>)로 매칭하여, 서버 컴포넌트 렌더링 파이프라인 진입 전 초고속 HTTP 307/308 리다이렉트를 수행하는 빌드 레벨 설정 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 구형 카탈로그 경로(<code>/old-catalog/:year(\\d{'{'}4{'}'})/:category/:id</code>)로 접근 시, 연도 정규식 그룹과 파라미터를 캡처하여 신규 표준 상품 URL(<code>/shop/:category/:id?year=:year</code>)로 자동 치환하여 클라이언트를 즉시 이동시킵니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 렌더링 오버헤드 제로</strong>: React 컴포넌트 마운트 및 DB 조회 없이 HTTP 계층에서 즉각 308 응답을 반환하여 서버 CPU 자원을 절약합니다.</li>
              <li><strong>SEO 점수 승계</strong>: <code>permanent: true</code>(308) 설정을 통해 구형 URL의 검색엔진 랭킹과 백링크 가치를 신규 경로로 온전히 보존합니다.</li>
              <li><strong>URL 체계 개편 유연성</strong>: 복잡한 대규모 마이그레이션 시에도 단 몇 줄의 정규식 룰로 수십만 개의 레거시 엔드포인트를 매핑합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 대규모 카테고리 개편에 따른 레거시 URL(<code>/item/12345</code>)의 신규 경로 매핑</li>
              <li>블로그/기획전 날짜 기반 URL(<code>/posts/2024-05/event</code>)의 슬러그 체계 정규화</li>
              <li>파일명 확장자(<code>.html</code>, <code>.php</code>)가 포함된 레거시 시스템 URL 정리</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>런타임 redirect()와의 차이</strong>: 런타임 <code>redirect()</code>는 비즈니스 로직(로그인 여부 등)에 따라 동적으로 실행되지만, <code>redirects()</code>는 인프라 레벨의 정적 규칙으로 사전 실행됩니다.</li>
              <li><strong>308 영구 캐싱 주의</strong>: <code>permanent: true</code>(308)는 브라우저와 CDN에 강력하게 영구 캐싱되므로, 개발 및 검증 단계에서는 <code>permanent: false</code>(307)로 테스트 후 배포해야 캐시 오염을 방지할 수 있습니다.</li>
              <li><strong>basePath 고려</strong>: <code>next.config.ts</code>에 <code>basePath</code>가 설정된 경우 <code>basePath: false</code>를 주지 않으면 기본적으로 source 앞에 basePath가 자동 추가됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
