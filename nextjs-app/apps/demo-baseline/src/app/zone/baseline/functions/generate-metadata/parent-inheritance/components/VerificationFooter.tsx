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

  const defaultExpected = "• 부모 metadata 상속 및 canonical URL 오버라이드의 동작과 기대 결과를 확인합니다."
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
        title="부모 metadata 상속 및 canonical URL 오버라이드 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="generateMetadata parent metadata 상속 및 타이틀 템플릿 합성">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>generateMetadata(props, parent)</code>의 두 번째 인수인 <code>parent: ResolvingMetadata</code>는 상위 레이아웃에서 정의된 메타데이터를 비동기 해결(resolve)하여, 상위 타이틀 템플릿(<code>%s | Acme Shop</code>)이나 오픈그래프 이미지를 자식 페이지에서 상속·병합할 수 있도록 지원합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 루트 레이아웃에 선언된 <code>title: {'{'} template: '%s | 공식 스토어', default: '공식 스토어' {'}'}</code> 설정을 하위 상품 상세 페이지가 <code>await parent</code>로 읽어와 합성하고, 상위 브랜드 로고 이미지에 상품 썸네일을 추가하는 상속 병합 결과를 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>일관된 브랜드 아이덴티티 유지</strong>: 모든 하위 페이지에 사이트 접미사(<code>| Acme Mall</code>)를 수동 작성하지 않고 상위 템플릿으로 자동 일괄 적용합니다.</li>
              <li><strong>상위 오픈그래프 이미지 병합</strong>: 상위 레이아웃의 기본 OG 이미지 배열에 하위 페이지의 특화 이미지를 손쉽게 추가(Append)합니다.</li>
              <li><strong>계층형 메타데이터 오버라이딩</strong>: 특정 하위 페이지만 필요한 메타 태그(예: <code>robots: noindex</code>)를 선별적으로 재정의합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>카테고리별 브랜드 접두사/접미사 템플릿 상속 (예: <code>신상품 | 패션관 | 쇼핑몰</code>)</li>
              <li>관리자 콘솔 전체의 공통 <code>robots: {'{'} index: false {'}'}</code> 보안 상속</li>
              <li>기본 파비콘 및 사내 공통 Open Graph 로고의 전체 하위 상속</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>parent 비동기 호출 비용</strong>: <code>await parent</code> 호출은 상위 레이아웃의 메타데이터 해결을 기다려야 하므로 꼭 필요한 경우에만 호출하여 메타데이터 생성 지연을 최소화해야 합니다.</li>
              <li><strong>배열 속성 덮어쓰기 주의</strong>: <code>openGraph.images</code> 등 배열 속성은 기본적으로 상위 배열을 완전히 덮어쓰므로, 상속을 원하면 <code>[...(parent.openGraph?.images || []), newImage]</code>로 명시적 병합을 해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
