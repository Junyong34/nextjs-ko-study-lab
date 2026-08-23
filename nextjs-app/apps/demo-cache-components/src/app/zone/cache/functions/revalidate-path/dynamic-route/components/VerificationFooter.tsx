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

  const defaultExpected = "• 동적 라우트 세그먼트 revalidatePath 동기화 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"

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
        title="동적 라우트 세그먼트 revalidatePath 동기화 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="동적 세그먼트 경로 대상 revalidatePath() 정밀 무효화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>동적 세그먼트 대상 <code>revalidatePath('/shop/[category]/[id]', 'page')</code>는 실제 URL 파라미터가 바인딩된 특정 인스턴스 경로(e.g. <code>/shop/shoes/prod-101</code>) 또는 동적 라우트 패턴 자체의 캐시를 온디맨드로 무효화하여 최신 정적 페이지를 재생성하는 표준 함수 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 <code>/zone/cache/products/shoes/prod-001</code> 경로의 상품 정보가 수정되었을 때, 다른 카테고리나 다른 상품 페이지의 캐시에는 전혀 영향을 주지 않고 오직 해당 단일 동적 세그먼트 페이지만 0ms 만에 즉각 무효화되는 격리성을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>불필요한 전역 캐시 소청 방지</strong>: 수정되지 않은 수만 개의 다른 상품 캐시를 보존하여 전체 사이트의 캐시 히트율을 안정적으로 유지합니다.</li>
                    <li><strong>직관적인 URL 기반 무효화</strong>: 별도의 태그 시스템 없이 비즈니스 URL 주소만으로 특정 페이지의 캐시를 손쉽게 갱신합니다.</li>
                    <li><strong>즉각적인 SEO 크롤러 최신화</strong>: 상품 정보 변경 즉시 검색엔진 크롤러가 접근할 정적 HTML 캐시를 새로고침합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>특정 상품의 가격 인하 및 품절 처리 즉시 해당 상품 페이지 단건 무효화</li>
                    <li>특정 사용자의 공개 프로필 페이지(<code>/users/[username]</code>) 정보 수정</li>
                    <li>단일 블로그 아티클(<code>/posts/[slug]</code>) 오타 수정 및 내용 업데이트</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>정확한 실제 경로 전달</strong>: 동적 라우트 패턴 문자열(<code>[id]</code>) 대신 실제 데이터가 바인딩된 실제 URL(e.g. <code>/shop/shoes/123</code>)을 전달해야 해당 페이지가 정확히 무효화됩니다.</li>
                    <li><strong>클라이언트 Router Cache 동시 무효화</strong>: <code>revalidatePath</code>는 서버 캐시뿐만 아니라 브라우저의 클라이언트 Router Cache도 함께 무효화하므로 즉각적인 UI 반영이 가능합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
