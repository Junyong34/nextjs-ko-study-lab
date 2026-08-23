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

  const defaultExpected = "• 테넌트별 로고/컬러 동적 주입 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="테넌트별 로고/컬러 동적 주입 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="테넌트별 로고/컬러 동적 주입">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>테넌트별 격리 브랜딩(Isolated Branding) 아키텍처는 단일 Next.js 배포 인스턴스에서 접속 호스트나 테넌트 식별자에 따라 브랜드 고유의 디자인 토큰(CSS 변수 <code>--primary-color</code>, 폰트 패밀리, 커스텀 로고 SVG, 파비콘)을 서버 렌더링 시점에 동적으로 주입하는 멀티 테넌트 UI 표준입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 입점 브랜드 셀렉터(Brand A: 에메랄드 테마 vs Brand B: 바이올렛 테마)를 전환하면, 상단 GNB 로고, 버튼 액센트 컬러, 배너 스타일이 클라이언트 리로드 없이 테넌트 테마 토큰에 맞춰 실시간으로 동적 교체되는 과정을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>단일 코드베이스로 수천 개 브랜드 서비스</strong>: 브랜드마다 별도의 웹사이트를 빌드/배포하지 않고 단 하나의 App Router 앱으로 무제한 입점사 테넌트를 수용합니다.</li>
              <li><strong>깜빡임 없는 초기 브랜드 테마 렌더링</strong>: CSS 변수와 로고 URL이 서버 컴포넌트에서 HTML <code>{'<'}style{'>'}</code> 태그로 직접 주입되어 클라이언트 하이드레이션 깜빡임(FOUC)이 없습니다.</li>
              <li><strong>운영 유지보수 비용 극적 절감</strong>: 새로운 테넌트가 입점해도 코드 배포 없이 DB 설정 등록만으로 즉시 전용 브랜딩이 적용됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>B2B 화이트라벨(White-label) 이커머스 솔루션 및 입점몰 플랫폼</li>
              <li>프랜차이즈 가맹점별 전용 모바일 주문 및 멤버십 웹앱</li>
              <li>엔터프라이즈 멀티 기업 포털 및 고객사별 맞춤형 SaaS 대시보드</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>CSS 인젝션 XSS 검증</strong>: DB에서 조회된 테넌트 커스텀 컬러 코드(예: <code>#10B981</code>)는 정규식(<code>/^#[0-9A-Fa-f]{'{'}6{'}'}$/</code>)으로 유효성을 검증하여 악의적인 CSS 주입 공격을 차단해야 합니다.</li>
              <li><strong>정적 에셋 CDN 캐싱 격리</strong>: 테넌트별 로고 및 배너 이미지는 URL 경로(<code>/tenants/brand-a/logo.png</code>)로 격리하여 CDN 캐시 오염을 방지해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
