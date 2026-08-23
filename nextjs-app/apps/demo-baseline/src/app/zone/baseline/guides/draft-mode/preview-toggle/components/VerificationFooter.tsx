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

  const defaultExpected = "• 미공개 특가 상품 Draft Mode 토글 및 Bypass 쿠키 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="미공개 특가 상품 Draft Mode 토글 및 Bypass 쿠키 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="미공개 특가 상품 Draft Mode 토글 및 Bypass 쿠키">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Next.js의 Draft Mode(<code>draftMode().enable()</code> / <code>draftMode().disable()</code>)는 정적으로 사전 렌더링(SSG/ISR)된 페이지를 헤드리스 CMS의 미발행 초안 데이터로 실시간 전환하여 검수할 수 있도록, 브라우저에 암호화된 Bypass 쿠키(<code>__prerender_bypass</code>)를 안전하게 주입하는 서버사이드 기능 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 [Draft Mode 켜기/끄기] 토글 버튼을 통해 일반 고객용 정적 캐시 모드(Live 모드)와 마케팅 담당자용 미공개 특가 초안 모드(Draft Preview) 간의 전환을 시뮬레이션합니다. Draft Mode 활성화 시 정적 캐시가 우회되어 미공개 특가 상품 데이터가 즉시 화면에 노출됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>정적 빌드 재생성 없는 즉각 검수</strong>: CMS에서 작성 중인 기획전/상품 초안을 배포나 ISR 캐시 퍼지 없이 즉시 확인합니다.</li>
              <li><strong>인증 쿠키 기반 보안 격리</strong>: 암호화된 서명 쿠키를 통해 일반 방문자에게는 정적 캐시를 제공하고, 인증된 관리자에게만 초안 데이터를 선별 렌더링합니다.</li>
              <li><strong>App Router 완벽 호환</strong>: 서버 컴포넌트 내부에서 <code>const {'{'} isEnabled {'}'} = await draftMode()</code>로 간단히 상태를 분기할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>정기 세일/블랙프라이데이 미공개 특가 상품 페이지 사전 마케팅 검수</li>
              <li>헤드리스 CMS(Sanity, Strapi, Contentful) 연동 콘텐츠 라이브 프리뷰</li>
              <li>신규 브랜드 론칭 기획전 페이지 발행 전 내부 리뷰</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Route Handler 시크릿 토큰 검증</strong>: Draft Mode 활성화 엔드포인트(예: <code>/api/draft</code>)는 반드시 CMS가 전달한 비밀 토큰(<code>secret</code>)을 검증한 뒤 <code>draftMode().enable()</code>을 호출해야 무단 접근을 방지할 수 있습니다.</li>
              <li><strong>Server Component 내 비동기 호출</strong>: Next.js 15+에서는 <code>draftMode()</code>가 비동기 Promise를 반환하므로 <code>const {'{'} isEnabled {'}'} = await draftMode()</code> 형태로 <code>await</code>해야 합니다.</li>
              <li><strong>SameSite/Secure 쿠키 속성</strong>: HTTPS 환경에서 쿠키가 유실되지 않도록 서명 쿠키의 도메인과 보안 설정을 확인해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
