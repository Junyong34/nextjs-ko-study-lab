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

  const defaultExpected = "• 셸에서 존으로의 rewrites 라우팅 (Multi-zones)의 동작과 기대 결과를 확인합니다."
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
        title="셸에서 존으로의 rewrites 라우팅 (Multi-zones) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="셸에서 존으로의 rewrites 라우팅 (Multi-zones)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js Multi-Zones 아키텍처는 거대한 모놀리식 웹 애플리케이션을 여러 개의 독립적인 Next.js 프로젝트(메인 셸, 블로그 존, 이커머스 결제 존, 관리자 존)로 분할하고, <code>next.config.ts</code>의 <code>rewrites()</code> 규칙을 통해 단일 도메인 아래에서 매끄럽게 통합 라우팅하는 마이크로 프론트엔드 표준 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 메인 쇼핑몰 셸(<code>demo-baseline</code>)에서 <code>/blog/*</code> 또는 <code>/admin/*</code> 경로로 이동할 때, 별도의 독립 배포된 서브 존 애플리케이션으로 프록시 재작성(Rewrite)되어 단일 SPA처럼 동작하는 과정을 시뮬레이션합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>독립 배포 및 빌드 시간 80% 단축</strong>: 팀별로 담당 존을 독립적으로 개발/빌드/배포할 수 있어 대규모 조직의 릴리즈 병목을 완전히 해소합니다.</li>
              <li><strong>장애 격리(Fault Isolation)</strong>: 블로그 존이나 어드민 존에 장애가 발생하더라도 핵심 이커머스 쇼핑몰 서비스는 중단 없이 정상 운영됩니다.</li>
              <li><strong>단일 도메인 SEO 및 세션 공유</strong>: 사용자와 검색엔진 관점에서는 서브도메인이 아닌 단일 도메인(<code>shop.com/blog</code>)으로 인식되어 SEO 가치와 쿠키 세션이 온전히 유지됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>대규모 포털의 메인 커머스 셸 + 콘텐츠 블로그 존 + 정산 관리자 존 분리</li>
              <li>레거시 Next.js/React 앱과 최신 App Router 신규 서비스의 점진적 마이그레이션</li>
              <li>독립된 여러 개발 조직(스쿼드) 간의 대규모 엔터프라이즈 모노레포 아키텍처</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>에셋 접두사(assetPrefix) 충돌 방지</strong>: 각 존 프로젝트의 <code>next.config.ts</code>에 고유한 <code>basePath</code> 또는 <code>assetPrefix</code>를 설정하여 <code>_next/static</code> 번들 파일 간의 덮어쓰기 충돌을 방지해야 합니다.</li>
              <li><strong>존 간 이동 시 하드 네비게이션 인지</strong>: 존과 존 사이를 <code>{'<'}Link{'>'}</code>로 이동할 때는 프레임워크 런타임이 다르므로 소프트 SPA 전환이 아닌 브라우저 전체 페이지 로드(Hard Navigation)가 발생함을 고려해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
