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

  const defaultExpected = "• Schema.org Product 구조화 데이터 (JSON-LD)의 동작과 기대 결과를 확인합니다."
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
        title="Schema.org Product 구조화 데이터 (JSON-LD) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="Schema.org Product 구조화 데이터 (JSON-LD)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>JSON-LD 구조화 데이터는 Schema.org 표준 규격(<code>Product</code>, <code>Offer</code>, <code>AggregateRating</code>)에 맞추어 상품명, 가격, 재고 상태, 평점 정보를 <code>{'<'}script type="application/ld+json"{'>'}</code>으로 서버 렌더링함으로써 검색엔진(Google/Naver)에 리치 스니펫(Rich Snippets)을 제공하는 SEO 표준 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 서버 컴포넌트가 상품 DB 정보(상품명, 가격 89,000원, 재고 상태 InStock, 별점 4.8)를 JSON-LD 스키마 객체로 변환하여 <code>dangerouslySetInnerHTML</code>로 페이지 <code>{'<'}head{'>'}</code>에 주입하고 유효성을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>검색 결과 클릭률(CTR) 30% 이상 향상</strong>: 구글 검색 결과에 상품 별점(⭐⭐⭐⭐⭐), 가격, 품절 여부가 리치 결과로 화려하게 노출되어 유입율을 극대화합니다.</li>
              <li><strong>검색엔진 크롤러 데이터 파싱 완벽 보장</strong>: 클라이언트 JS 실행 전 초기 HTML 소스에 JSON-LD가 포함되어 크롤링 예산(Crawl Budget) 낭비 없이 100% 색인됩니다.</li>
              <li><strong>타입 안전한 스키마 생성</strong>: <code>schema-dts</code> 라이브러리와 연계하여 복잡한 Schema.org 프로퍼티의 타입 오류를 컴파일 타임에 사전 방지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>전자상거래 쇼핑몰 상품 상세 페이지(가격, 할인율, 재고 상태)</li>
              <li>구매자 상품 리뷰 목록 및 평점 요약 스키마(AggregateRating)</li>
              <li>회사 소개 페이지 및 고객센터 FAQ 아코디언 스키마(FAQPage)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>XSS 방지를 위한 직렬화 주의</strong>: 사용자 입력이 포함될 수 있는 필드는 <code>JSON.stringify(schema).replace(/{'<'}/g, '\\u003c')</code> 형태로 이스케이프하여 스크립트 인젝션을 방어해야 합니다.</li>
              <li><strong>화면 표시 정보와의 일치성</strong>: JSON-LD에 기재된 가격/재고 정보가 실제 사용자 화면에 렌더링된 정보와 불일치할 경우 검색엔진의 스팸 페널티를 받을 수 있으므로 동일한 데이터 소스를 참조해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
