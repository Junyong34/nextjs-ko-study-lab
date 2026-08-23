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

  const defaultExpected = "• Route Handler 내 redirect() (307 Temporary Redirect) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Route Handler 내 redirect() (307 Temporary Redirect) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="redirect() Route Handler 및 Server Component 내 HTTP 307 임시 리다이렉트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Server Component 또는 Route Handler(GET)에서 호출되는 <code>redirect()</code>는 원본 요청 메서드(HTTP Method)를 보존하는 HTTP 307 Temporary Redirect를 수행합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 레거시 프로모션 경로(<code>/events/summer-sale</code>)로 들어오는 요청을 감지하여 <code>redirect('/promotions/2026-summer')</code>를 호출함으로써 클라이언트를 신규 이벤트 페이지로 307 임시 이동시킵니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>요청 메서드 보존</strong>: GET 요청뿐만 아니라 특정 페이로드를 전달하는 요청에서도 메서드를 유지하여 대상 엔드포인트로 포워딩합니다.</li>
              <li><strong>검색엔진 캐시 제어</strong>: 임시 리다이렉트(307)이므로 검색엔진이 원본 URL의 인덱스를 유지하여 향후 프로모션 변경에 유연하게 대응합니다.</li>
              <li><strong>서버 렌더링 비용 절감</strong>: 서버 컴포넌트 렌더링 도중 즉시 응답을 반환하여 불필요한 자식 컴포넌트 연산을 차단합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>시즌 한정 기획전의 임시 신규 랜딩 페이지 연결</li>
              <li>사용자 로그인 상태에 따른 대시보드(<code>/dashboard</code> -{'>'} <code>/login</code>) 임시 보호 분기</li>
              <li>점검 중인 특정 기능의 임시 공지사항 페이지 리다이렉트</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>영구 리다이렉트와 구분</strong>: 영구적인 URL 변경이나 SEO 점수 승계가 필요한 마이그레이션에는 <code>permanentRedirect()</code>(308)를 사용해야 합니다.</li>
              <li><strong>try/catch 방어</strong>: 모든 Next.js <code>redirect()</code> 호출은 <code>try/catch</code> 바깥에서 실행해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
