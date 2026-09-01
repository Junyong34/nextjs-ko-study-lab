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

  const defaultExpected = "• 외부 PG사 결제 SDK onLoad 이벤트 핸들링의 동작과 기대 결과를 확인합니다."
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
        title="외부 PG사 결제 SDK onLoad 이벤트 핸들링 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="외부 PG사 결제 SDK onLoad 이벤트 핸들링">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>next/script</code> 컴포넌트는 <code>strategy="lazyOnload"</code> 또는 <code>"afterInteractive"</code>와 함께 <code>onLoad</code> 및 <code>onReady</code> 라이프사이클 콜백을 제공하여, 외부 결제창(PG) SDK나 카카오맵 등의 대용량 JS가 브라우저에 완전히 로드된 시점에 안전하게 초기화 객체를 바인딩하는 표준 API입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 포트원/토스페이먼츠 결제 SDK 스크립트 로드 시 <code>onLoad={'{'}() ={'>'} setSdkReady(true){'}'}</code> 콜백을 감지하여 [결제창 호출] 버튼을 활성화하고, SDK 미로드 상태에서의 <code>window.IMP is undefined</code> 크래시를 원천 차단합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>결제 스크립트 미로드 크래시 원천 방지</strong>: 글로벌 객체(<code>window.TossPayments</code>)가 준비되기 전에 결제 함수를 호출하여 발생하는 런타임 TypeError를 100% 방지합니다.</li>
              <li><strong>초기 페이지 로딩 성능(LCP) 보호</strong>: 무거운 결제 모듈을 페이지 렌더링 완료 후 지연 로드(lazyOnload)하여 초기 쇼핑몰 화면 렌더링 속도를 저하시키지 않습니다.</li>
              <li><strong>선언적 스크립트 중복 방지</strong>: 동일한 SDK 스크립트가 여러 번 마운트되더라도 Next.js가 중복 다운로드를 자동으로 방지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>KG이니시스, 토스페이먼츠, 포트원(아임포트) 주문 결제창 SDK 연동</li>
              <li>카카오페이 / 네이버페이 간편결제 팝업 SDK 초기화</li>
              <li>매장 위치 안내를 위한 네이버 지도 / 카카오맵 JavaScript API 로딩</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>onReady vs onLoad 선택 기준</strong>: <code>onLoad</code>는 최초 1회 스크립트 다운로드 시에만 실행되므로, 라우트 이동 후 컴포넌트가 재마운트될 때마다 재초기화가 필요한 경우에는 <code>onReady</code> 콜백을 사용해야 합니다.</li>
              <li><strong>TypeScript 전역 window 타입 확장</strong>: <code>window.TossPayments</code> 같은 외부 글로벌 객체를 참조할 때는 <code>window.d.ts</code>에 인터페이스를 정의해야 컴파일러 에러를 방지할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
