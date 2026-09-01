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

  const defaultExpected = "• 이용약관 정적 SSG 페이지 생성 및 캐시의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="이용약관 정적 SSG 페이지 생성 및 캐시 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="이용약관 정적 SSG 페이지 생성 및 캐시">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>정적 사이트 생성(SSG)은 자주 변경되지 않는 공용 페이지(이용약관, 개인정보처리방침, 회사 소개)를 빌드 시점에 순수 정적 HTML 파일로 사전 렌더링하여, 글로벌 CDN 엣지에서 0ms TTFB 속도로 서빙하는 Next.js의 핵심 렌더링 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 전자상거래 표준 이용약관 및 개인정보 처리방침 전문을 SSG로 컴파일하여, 서버 CPU 연산 및 DB 쿼리 없이 CDN 캐시 히트(Cache-HIT)로 브라우저에 즉각 전달되는 초고속 응답을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 부하 0% 및 무제한 트래픽 감당</strong>: 대규모 마케팅이나 트래픽 폭증 상황에서도 정적 HTML이 CDN 엣지에서 캐시 서빙되어 오리진 서버에 부하를 주지 않습니다.</li>
              <li><strong>글로벌 최저 응답 지연(TTFB {'<'} 20ms)</strong>: 전 세계 CDN 엣지 노드에서 캐시된 정적 파일을 사용자에게 즉시 전송하여 최고 속도의 페이지 로드를 달성합니다.</li>
              <li><strong>운영 인프라 비용 극적 절감</strong>: 동적 SSR 서버 인스턴스를 확장할 필요 없이 S3/Cloudflare Pages 등의 정적 스토리지로 저비용 서빙이 가능합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 전자상거래 표준 이용약관 및 개인정보 취급방침 페이지</li>
              <li>기업 연혁, 오시는 길, 투자자 정보(IR) 정적 웹페이지</li>
              <li>오픈소스 라이선스 고지 및 서비스 환불/배송 규정 안내 페이지</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>동적 함수 사용 금지</strong>: 페이지 내부에서 <code>cookies()</code>, <code>headers()</code>, <code>searchParams</code> 등의 동적 API를 호출하면 SSG에서 동적 SSR로 탈락하므로 주의해야 합니다.</li>
              <li><strong>약관 개정 시 온디맨드 revalidation 연동</strong>: 약관 내용이 변경되었을 때는 <code>revalidatePath('/terms')</code>를 호출하여 전체 사이트 재빌드 없이 해당 페이지만 즉시 갱신할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
