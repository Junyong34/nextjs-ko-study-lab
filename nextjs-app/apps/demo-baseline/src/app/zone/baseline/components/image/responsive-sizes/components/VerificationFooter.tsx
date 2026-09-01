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

  const defaultExpected = "• next/image responsive fill & sizes 속성 반응형 로딩의 동작과 기대 결과를 확인합니다."
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
        title="next/image responsive fill & sizes 속성 반응형 로딩 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="next/image responsive fill & sizes 속성 반응형 로딩">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/image</code>의 <code>fill</code> 속성과 <code>sizes</code> 속성은 부모 컨테이너 크기에 맞춰 반응형으로 확장되는 유동 레이아웃에서, 브라우저가 현재 뷰포트 너비(모바일/태블릿/데스크톱)에 가장 적합한 최적 해상도의 이미지를 <code>srcset</code>에서 선택 다운로드하도록 지시하는 이미지 최적화 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 반응형 3단 상품 그리드에서 <code>sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"</code>를 적용하여, 모바일에서는 390px, 데스크톱에서는 400px에 최적화된 WebP/AVIF 이미지만 선별 다운로드하여 모바일 데이터 낭비를 방지하는 과정을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>모바일 데이터 대역폭 절약</strong>: 고해상도 데스크톱 이미지가 모바일 화면에 낭비 전송되는 것을 막아 초기 페이지 로딩 속도를 향상시킵니다.</li>
              <li><strong>부모 요소 반응형 완벽 결합</strong>: <code>fill</code> 속성을 통해 고정 width/height 없이도 CSS Aspect-Ratio 및 Flex/Grid 컨테이너에 완벽히 들어맞는 레이아웃을 구성합니다.</li>
              <li><strong>자동 차세대 포맷(AVIF/WebP) 트랜스코딩</strong>: 브라우저 지원 여부에 따라 가장 가벼운 최신 압축 포맷으로 온디맨드 변환 서빙합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>반응형 이커머스 상품 카드 그리드 (모바일 1열, 태블릿 2열, 데스크톱 4열)</li>
              <li>뷰포트 너비에 따라 비율이 변하는 풀위드(Full-width) 프로모션 배너</li>
              <li>다양한 해상도 모바일 디바이스에 최적화된 리뷰 갤러리 썸네일</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>fill 사용 시 부모 스타일 필수</strong>: <code>fill</code> 속성을 사용할 때는 부모 컨테이너에 반드시 <code>position: relative</code>, <code>position: absolute</code>, 또는 <code>position: fixed</code>가 지정되어 있어야 이미지가 화면 전체로 넘치지 않습니다.</li>
              <li><strong>sizes 생략 시 기본값 주의</strong>: <code>sizes</code>를 생략하고 <code>fill</code>을 쓰면 브라우저가 기본값으로 <code>100vw</code>를 가정하여 모바일에서도 큰 원본 이미지를 다운로드하므로 <code>sizes</code>를 반드시 명시해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
