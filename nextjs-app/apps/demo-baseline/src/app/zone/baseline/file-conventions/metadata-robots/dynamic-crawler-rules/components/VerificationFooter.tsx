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

  const defaultExpected = "• robots.ts 파일에서 MetadataRoute.Robots 객체 반환\n• Next.js가 robots.txt 텍스트 엔드포인트를 자동 생성하여 크롤러 규칙(Allow/Disallow/Sitemap) 제공"
  const defaultActual = "• robots.ts 파일 컨벤션 파이프라인 마운트 완료 및 크롤링 규칙 직렬화 확인\n• User-Agent 필터링 및 관리자/결제 경로 차단 정책 감지"

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
        title="동적 검색 크롤러 규칙 (robots.ts) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router의 robots.ts 특수 파일을 통한 검색 로봇 접근 제어 및 SEO 정책 동적 구성을 검증합니다."}
      />
      <DemoDeepDiveCard title="동적 검색 크롤러 규칙 (robots.ts) & 환경별 인덱싱 제어">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>robots.ts</code>는 App Router 루트 세그먼트에서 <code>MetadataRoute.Robots</code> 객체를 반환하여 검색엔진 크롤러(Googlebot, Yeti 등)를 위한 <code>/robots.txt</code> 텍스트 지침을 동적으로 생성하고 서빙하는 표준 파일입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 실행 환경(<code>process.env.VERCEL_ENV</code> 또는 <code>NODE_ENV</code>)에 따라 스테이징/QA 서버에서는 전체 크롤링을 차단(<code>Disallow: /</code>)하고, 프로덕션 환경에서는 관리자/결제 경로(<code>Disallow: ['/admin', '/checkout']</code>)만 선별 차단하며 사이트맵 인덱스 URL을 동적으로 주입하는 규칙을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>개발/스테이징 검색 노출 사고 원천 방지</strong>: 환경변수 조건문을 통해 테스트 사이트가 검색엔진에 무단 색인되는 치명적인 SEO 사고를 차단합니다.</li>
              <li><strong>TypeScript 기반 크롤링 규칙 정의</strong>: 오타나 잘못된 포맷 없이 타입 안전하게 User-Agent, Allow, Disallow, Sitemap URL을 관리합니다.</li>
              <li><strong>도메인별 멀티 호스트 대응</strong>: 요청 호스트 헤더에 따라 서로 다른 브랜드 도메인의 사이트맵 경로를 유연하게 분기합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>프로덕션 vs 스테이징/QA 환경별 검색 인덱싱 자동 허용/차단</li>
              <li>관리자 대시보드 및 개인정보/결제 페이지의 크롤러 접근 차단</li>
              <li>멀티 도메인 쇼핑몰의 국가별 사이트맵 URL 동적 매핑</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>public/robots.txt 삭제 필수</strong>: <code>public/robots.txt</code> 정적 텍스트 파일이 존재하면 동적 <code>robots.ts</code>가 무시되므로 정적 파일은 반드시 제거해야 합니다.</li>
              <li><strong>Sitemap 절대 URL 작성</strong>: <code>sitemap</code> 속성에는 상대 경로가 아닌 전체 도메인을 포함한 절대 URL(<code>https://example.com/sitemap.xml</code>)을 입력해야 검색 크롤러가 올바르게 인식합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
