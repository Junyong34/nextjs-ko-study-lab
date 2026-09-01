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

  const defaultExpected = "• 상품 기술 문서 MDX 렌더링의 동작과 기대 결과를 확인합니다."
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
        title="상품 기술 문서 MDX 렌더링 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="상품 기술 문서 MDX 렌더링">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js App Router의 MDX 기술 문서 렌더링은 마크다운 문법(Heading, Tables, Code Blocks)과 디자인 시스템 컴포넌트를 결합하여, 대규모 상품 스펙 명세서와 사용자 기술 매뉴얼을 고속 서버 컴포넌트로 사전 렌더링하는 문서화 표준입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 전자제품(스마트워치 PROD-001)의 상세 사양표, 방수 등급 표, 코드 스니펫 및 부품 다이어그램이 포함된 MDX 문서를 렌더링하고, 코드 복사 버튼과 수량 변경 인터랙션을 실증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>검색엔진 최적화(SEO) 극대화</strong>: 기술 문서의 모든 목차와 텍스트가 서버사이드에서 순수 HTML로 완성되어 검색엔진 크롤러에 완벽하게 색인됩니다.</li>
              <li><strong>일관된 디자인 시스템 적용</strong>: 마크다운의 <code>{'<'}h2{'>'}</code>, <code>{'<'}table{'>'}</code>, <code>{'<'}code{'>'}</code> 태그를 Tailwind CSS가 적용된 전사 표준 UI 컴포넌트로 자동 치환합니다.</li>
              <li><strong>빌드 타임 문법 검증</strong>: MDX 컴파일 단계에서 잘못된 마크업 닫기 태그나 오타를 사전 감지하여 문서 무결성을 보장합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>전자제품, 기계 부품, 소프트웨어의 정밀 기술 사양 및 호환성 가이드</li>
              <li>B2B 전자상거래 결제 연동 가이드 및 개발자 API 레퍼런스</li>
              <li>기업 제품 보증 정책 및 A/S 규정 안내 매뉴얼</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>remark/rehype 플러그인 호환성</strong>: 코드 하이라이팅(Shiki, Prism)이나 목차 생성(TOC)을 위해 플러그인을 추가할 때는 App Router의 비동기 컴파일 파이프라인과 호환되는 버전을 선택해야 합니다.</li>
              <li><strong>이미지 최적화 연동</strong>: MDX 내 일반 마크다운 이미지 <code>![]()</code> 태그를 Next.js의 <code>next/image</code> 컴포넌트로 매핑하여 이미지 CLS와 용량을 최적화해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
