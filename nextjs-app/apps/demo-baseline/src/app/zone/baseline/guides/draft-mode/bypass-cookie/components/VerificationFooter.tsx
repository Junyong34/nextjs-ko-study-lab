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

  const defaultExpected = "• Bypass 쿠키 검증 및 CMS 초안 렌더링 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Bypass 쿠키 검증 및 CMS 초안 렌더링 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="Bypass 쿠키 검증 및 CMS 초안 렌더링">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>__prerender_bypass</code> 쿠키는 Next.js Draft Mode가 생성하는 서명된 암호화 쿠키로, Next.js 내부 캐시 계층(Data Cache 및 Full Route Cache)이 이 쿠키를 감지하면 정적 캐시 조회를 건너뛰고(Bypass) 원본 데이터 소스로부터 최신 초안 데이터를 동적으로 페치하도록 지시합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 VIP 시크릿 특가전 상품 상세 화면에서 [초안 검수 모드 켜기]를 실행했을 때, Bypass 쿠키가 적용되어 정적 캐시(정상 판매가 399,000원) 대신 0ms 지연으로 미공개 VIP 40% 특가 초안 데이터(249,000원)가 즉시 페치 및 렌더링되는 과정을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>프로덕션 무중단 검수</strong>: 일반 고객 서비스에 영향을 주지 않으면서 실제 운영 환경과 동일한 도메인/인프라에서 초안을 검증합니다.</li>
              <li><strong>캐시 오염(Cache Poisoning) 방지</strong>: Bypass 모드로 조회된 초안 데이터는 공유 캐시나 CDN에 저장되지 않아 일반 고객에게 노출될 위험이 원천 차단됩니다.</li>
              <li><strong>헤드리스 CMS 프리뷰 완벽 연동</strong>: Sanity, Contentful 등의 실시간 초안 미리보기 iframe 임베딩을 완벽 지원합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>이커머스 시즌 기획전(설날/추석 특가전) 오픈 전 가격 및 배너 최종 검수</li>
              <li>마케팅팀의 블로그 포스트 및 이벤트 상세 페이지 발행 전 실시간 프리뷰</li>
              <li>신규 입점 브랜드 상품 카탈로그 승인 심사 프로세스</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>fetch 캐시 옵션 확인</strong>: Server Component 내 <code>fetch</code> 호출 시 <code>cache: 'force-cache'</code>를 사용하더라도 Draft Mode 활성화 시 자동으로 캐시가 우회됩니다. 단, 서드파티 ORM이나 SDK 사용 시에는 <code>draftMode().isEnabled</code> 여부에 따른 분기 처리가 필요할 수 있습니다.</li>
              <li><strong>검수 완료 후 쿠키 제거</strong>: 검수가 끝난 후에는 <code>draftMode().disable()</code> 엔드포인트를 호출하여 브라우저의 Bypass 쿠키를 반드시 삭제해야 불필요한 동적 렌더링 비용을 줄일 수 있습니다.</li>
              <li><strong>Edge 배포 시 쿠키 전달</strong>: 프록시나 CDN 계층(Cloudflare/CloudFront)에서 <code>__prerender_bypass</code> 쿠키 헤더를 오리진 서버로 온전히 포워딩하도록 캐시 키 규칙을 설정해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
