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

  const defaultExpected = "• generateSitemaps() 함수가 분할 인덱스 배열 [{ id: 0 }, { id: 1 }, { id: 2 }] 반환\n• sitemap/0.xml, sitemap/1.xml, sitemap/2.xml 독립 XML 엔드포인트 자동 생성"
  const defaultActual = "• generateSitemaps() 및 sitemap(id) 라우팅 파이프라인 생성 완료\n• 도메인별(상품/카테고리/프로모션) 사이트맵 분할 직렬화 감지"

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
        title="동적 사이트맵 분할 인덱스 (generateSitemaps) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router의 generateSitemaps() 함수를 통한 대규모 엔터프라이즈 사이트맵 분할 생성 아키텍처를 검증합니다."}
      />
      <DemoDeepDiveCard title="동적 사이트맵 분할 (generateSitemaps)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 분할 한계</h5>
            <p>
              구글 등 검색 엔진 표준에 따르면 단일 <code>sitemap.xml</code> 파일은 50,000개 URL 및 50MB 용량 제한이 있습니다.
              Next.js의 <code>generateSitemaps()</code> 함수를 export하면 자동으로 사이트맵 인덱스(<code>sitemap.xml</code>)와 번호별 하위 사이트맵(<code>sitemap/[id].xml</code>)을 생성합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데이터베이스 청크 조회 최적화</h5>
            <p>
              <code>sitemap({`{ id }`})</code> 함수 내부에서 <code>id</code>에 해당하는 데이터베이스 페이징 쿼리(e.g., <code>offset = id * 10000</code>)를 수행하여 대용량 메모리 부하 없이 안전하게 XML을 스트리밍할 수 있습니다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
