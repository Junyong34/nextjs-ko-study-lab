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

  const defaultExpected = '• 다이나믹 라우트 세그먼트에 대한 revalidatePath 동작과 기대 결과를 확인합니다.'
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
        title="다이나믹 라우트 세그먼트의 revalidatePath 동작 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="다이나믹 세그먼트 경로의 revalidatePath() 무효화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>다이나믹 세그먼트 대상 <code>revalidatePath('/shop/[category]/[id]', 'page')</code>는 실제 URL 파라미터가 바인딩된 특정 경로(e.g. <code>/shop/shoes/prod-101</code>) 또는 다이나믹 라우트 패턴의 캐시를 온디맨드로 무효화합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>이 예제에서는 <code>/zone/cache/products/shoes/prod-001</code> 경로의 상품 정보가 수정될 때 다른 카테고리나 상품 페이지의 캐시는 그대로 두고 해당 다이나믹 세그먼트의 캐시만 무효화하는 흐름을 확인합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>불필요한 전역 캐시 요청 방지</strong>: 수정되지 않은 다른 상품 캐시를 그대로 두어 필요한 범위만 갱신합니다.</li>
                    <li><strong>직관적인 URL 기반 무효화</strong>: 별도의 태그 시스템 없이 비즈니스 URL 주소만으로 특정 페이지의 캐시를 손쉽게 갱신합니다.</li>
                    <li><strong>페이지 단위 갱신</strong>: 상품 정보가 바뀐 페이지의 캐시만 갱신합니다.</li>
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
                    <li><strong>실제 경로 전달</strong>: 다이나믹 라우트 패턴 문자열(<code>[id]</code>) 대신 실제 데이터가 바인딩된 URL(e.g. <code>/shop/shoes/123</code>)을 전달해야 해당 페이지를 정확히 무효화할 수 있습니다.</li>
                    <li><strong>클라이언트 Router Cache 동시 무효화</strong>: <code>revalidatePath</code>는 서버 캐시뿐만 아니라 브라우저의 클라이언트 Router Cache도 함께 무효화하므로 즉각적인 UI 반영이 가능합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
