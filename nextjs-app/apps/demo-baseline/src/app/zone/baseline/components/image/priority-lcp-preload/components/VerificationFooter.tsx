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

  const defaultExpected = "• priority 속성을 통한 LCP 이미지 사전 로드의 동작과 기대 결과를 확인합니다."
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
        title="priority 속성을 통한 LCP 이미지 사전 로드 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="next/image priority 속성을 통한 LCP 이미지 사전 로드">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/image</code>의 <code>priority={'{'}true{'}'}</code> 속성은 뷰포트 상단에 노출되는 가장 큰 콘텐츠 이미지(LCP: Largest Contentful Paint)에 대해 브라우저 지연 로딩(Lazy Loading)을 비활성화하고, HTML <code>{'<'}head{'>'}</code>에 <code>{'<'}link rel="preload"{'>'}</code> 및 <code>fetchpriority="high"</code> 속성을 주입하여 네트워크 최우선 순위로 다운로드하는 성능 최적화 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 쇼핑몰 히어로 프로모션 배너에 <code>priority</code>를 적용했을 때, 브라우저가 첫 번째 렌더링 사이클에서 배너 이미지를 즉시 발견하여 LCP 도달 시간을 50% 이상 단축하는 메커니즘을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>LCP 코어 웹 바이탈 점수 극대화</strong>: 상단 대표 이미지의 로딩 대기 시간을 최소화하여 검색엔진 랭킹과 Core Web Vitals 점수를 끌어올립니다.</li>
              <li><strong>자동 브라우저 preload 힌트 주입</strong>: 서버 사이드 렌더링 단계에서 HTML <code>{'<'}head{'>'}</code>에 정확한 이미지 <code>imagesrcset</code> preload 태그를 자동 주입합니다.</li>
              <li><strong>이미지 로딩 폭포수(Waterfall) 단축</strong>: CSS나 JS 파싱 완료를 기다리지 않고 브라우저 프리로드 스캐너가 이미지를 즉시 페치합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 메인 페이지 최상단 히어로 롤링 배너</li>
              <li>상품 상세 페이지 첫 화면에 노출되는 메인 대표 썸네일</li>
              <li>브랜드 랜딩 페이지의 풀스크린 배경 비주얼 이미지</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>스크롤 하단(Below-the-fold) 이미지에 priority 남발 금지</strong>: 첫 화면에 보이지 않는 스크롤 하단 이미지에 <code>priority</code>를 설정하면 정작 중요한 LCP 자원 및 스크립트 다운로드를 방해하므로, 페이지당 1~2개의 핵심 LCP 요소에만 선별 지정해야 합니다.</li>
              <li><strong>sizes 속성과 병행 권장</strong>: 브라우저가 적절한 해상도의 프리로드 이미지를 선택할 수 있도록 <code>priority</code>와 함께 <code>sizes</code> 속성을 반드시 명시해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
