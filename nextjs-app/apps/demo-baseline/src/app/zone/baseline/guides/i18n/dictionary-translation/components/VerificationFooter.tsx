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

  const defaultExpected = "• 서버 측 JSON 사전 기반 번역 렌더링의 동작과 기대 결과를 확인합니다."
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
        title="서버 측 JSON 사전 기반 번역 렌더링 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="서버 측 JSON 사전 기반 번역 렌더링">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>서버 사이드 사전(Dictionary) 번역은 대규모 클라이언트 i18n 라이브러리(i18next 등) 없이, 서버 컴포넌트에서 언어별 JSON 사전(<code>dictionaries/ko.json</code>, <code>en.json</code>)을 동적으로 로드하여 순수 텍스트로 완성된 번역 HTML을 렌더링하는 초경량 다국어 아키텍처 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 상단 언어 전환 토글(한국어 ↔ English) 클릭 시 서버 컴포넌트가 해당 로케일의 번역 사전을 읽어 <code>dict.welcome</code>("환영합니다" ↔ "Welcome"), <code>dict.checkout</code>("결제하기" ↔ "Checkout")을 클라이언트 번들 추가 없이 즉각 렌더링합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>클라이언트 i18n 번들 제로(Zero-Bundle-Size i18n)</strong>: 수십 KB의 다국어 번역 사전과 파싱 라이브러리를 브라우저로 전송하지 않아 초기 JS 용량을 획기적으로 줄입니다.</li>
              <li><strong>검색엔진 다국어 완벽 색인</strong>: 각 언어별 번역 텍스트가 서버 렌더링 단계에서 HTML에 각인되어 글로벌 검색엔진에 정확히 수집됩니다.</li>
              <li><strong>타입 안전한 사전 키 참조</strong>: TypeScript의 <code>typeof import('@/dictionaries/ko.json')</code>를 통해 존재하지 않는 번역 키 참조를 컴파일 타임에 차단합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>글로벌 쇼핑몰 결제, 장바구니, 상품 상세 다국어 번역 (KO/EN/JA/ZH)</li>
              <li>글로벌 B2B SaaS 대시보드 공통 네비게이션 및 에러 메시지 현지화</li>
              <li>다국어 브랜드 랜딩 페이지 및 회사 소개 웹사이트</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>동적 사전 로더 함수 구성</strong>: <code>const getDictionary = async (locale) ={'>'} dictionaries[locale]()</code> 패턴으로 작성하여 필요한 언어의 JSON 파일만 동적으로 로드해야 합니다.</li>
              <li><strong>복수형(Pluralization) 및 동적 보간</strong>: 변수 치환(<code>{'{'}name{'}'}</code>)이나 복수형 처리가 복잡한 경우 작은 유틸리티 함수를 정의하여 서버에서 렌더링 전 치환해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
