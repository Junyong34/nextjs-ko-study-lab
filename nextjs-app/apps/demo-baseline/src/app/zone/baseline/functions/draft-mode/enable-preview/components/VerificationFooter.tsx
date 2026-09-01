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

  const defaultExpected = "• draftMode().enable() 초안 모드 활성화의 동작과 기대 결과를 확인합니다."
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
        title="draftMode().enable() 초안 모드 활성화 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="draftMode().enable() CMS 미공개 상품 프리뷰 활성화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>draftMode().enable()</code> (<code>next/headers</code>)는 CMS의 미공개 초안 콘텐츠를 확인할 수 있도록 특수 Bypass 쿠키(<code>__prerender_bypass</code>)를 발급하여 정적 캐시를 우회하고 실시간 SSR을 활성화하는 표준 API입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 Route Handler에서 CMS 시크릿 토큰을 검증한 후 <code>(await draftMode()).enable()</code>을 호출하여 프리뷰 모드를 활성화하고, 상품 상세 페이지에서 미공개 특가 상품의 초안 데이터를 즉시 렌더링합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>정적 빌드 유지 & 즉시 미리보기</strong>: 전체 사이트는 고속 정적 캐시(SSG)로 서빙하면서 CMS 관리자에게만 실시간 초안을 노출합니다.</li>
              <li><strong>보안 서명 쿠키</strong>: 암호화된 바이패스 쿠키를 사용하여 승인되지 않은 일반 사용자의 미공개 콘텐츠 접근을 차단합니다.</li>
              <li><strong>Server Action/Router 연동</strong>: 라우트 재빌드 없이 단 몇 밀리초 만에 초안 페이지를 렌더링합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>Headless CMS(Contentful, Sanity, Strapi)의 미발행 기획전 사전 검수</li>
              <li>신규 런칭 상품 상세 페이지의 출시 전 내부 MD 및 마케터 최종 검토</li>
              <li>정기 배포 전 A/B 테스트용 랜딩 페이지 초안 미리보기</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>시크릿 토큰 인증 필수</strong>: 프리뷰 활성화 엔드포인트는 악의적인 캐시 바이패스를 막기 위해 반드시 CMS 시크릿 키 검증 로직을 포함해야 합니다.</li>
              <li><strong>일반 사용자 유출 방지</strong>: 프리뷰 모드가 켜진 상태의 URL을 일반 고객에게 공유하면 캐시 우회로 인한 서버 부하가 발생하므로 주의해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
