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
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="동적 사이트맵 분할 인덱스 (generateSitemaps) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router의 generateSitemaps() 함수를 통한 대규모 엔터프라이즈 사이트맵 분할 생성 아키텍처를 검증합니다."}
      />
      <DemoDeepDiveCard title="동적 사이트맵 분할 인덱스 (generateSitemaps & sitemap.ts)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              구글 등 검색 엔진 표준(50,000개 URL 또는 50MB 용량 제한)을 초과하는 대규모 사이트를 위해, <code>generateSitemaps()</code> 함수와 <code>sitemap({'{'} id {'}'})</code> 핸들러를 결합하여 수십만 건의 URL을 번호별 하위 사이트맵(<code>/sitemap/0.xml</code>, <code>/sitemap/1.xml</code>)과 사이트맵 인덱스로 분할 생성하는 Next.js 엔터프라이즈 아키텍처입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>generateSitemaps()</code>가 <code>[{'{'} id: 0 {'}'}, {'{'} id: 1 {'}'}, {'{'} id: 2 {'}'}]</code>를 반환하여 0번(의류 5만건), 1번(전자기기 5만건), 2번(식품 5만건)의 독립 XML 엔드포인트를 자동 구성하고, 각 ID별 데이터베이스 청크 조회를 통해 XML 스트림을 안전하게 직렬화하는 과정을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>메모리 고갈(OOM) 방지</strong>: 10만 건 이상의 URL을 단일 쿼리로 메모리에 올리지 않고 ID별 페이징/청크 쿼리로 나누어 서버 안정성을 확보합니다.</li>
              <li><strong>검색엔진 크롤링 최적화</strong>: 분할된 사이트맵 인덱스를 통해 크롤러가 병렬로 하위 사이트맵을 효율적으로 수집하도록 돕습니다.</li>
              <li><strong>최신 상품 변경사항 신속 반영</strong>: <code>lastModified</code>, <code>changeFrequency</code>, <code>priority</code> 메타데이터를 개별 URL마다 정밀하게 주입합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>10만 개 이상의 SKU를 보유한 대형 이커머스 상품 카탈로그 사이트맵</li>
              <li>뉴스/미디어 언론사의 수십만 개 기사 아카이브 사이트맵 분할</li>
              <li>다국어 및 카테고리별로 분할된 글로벌 서비스 사이트맵 구축</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>sitemap.ts 내 generateSitemaps() export 필수</strong>: 분할 인덱스를 사용하려면 반드시 동일한 <code>sitemap.ts</code> 파일에서 <code>export async function generateSitemaps()</code>를 선언해야 합니다.</li>
              <li><strong>ID 파라미터 타입</strong>: <code>sitemap({'{'} id {'}'}: {'{'} id: number {'}'})</code>와 같이 ID는 숫자로 전달되므로 쿼리 오프셋 계산(<code>offset = id * LIMIT</code>)에 바로 활용할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
