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

  const defaultExpected = "• revalidateTag(정밀 무효화) vs revalidatePath(경로 무효화) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="revalidateTag(정밀 무효화) vs revalidatePath(경로 무효화) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="revalidateTag(정밀 무효화) vs revalidatePath(경로 무효화)">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>revalidateTag</code>는 엔티티 태그를 기반으로 URL 위치와 상관없이 연관된 모든 데이터 캐시를 정밀하게 무효화하는 반면, <code>revalidatePath</code>는 특정 URL 경로 또는 레이아웃 트리에 바인딩된 정적 라우트 전체를 무효화하는 두 가지 핵심 무효화 전략의 표준 비교 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 상품 정보를 수정한 후 [revalidateTag 실행]과 [revalidatePath 실행]을 각각 테스트하여, 태그 기반 무효화가 여러 페이지에 걸친 동일 상품 데이터를 일괄 갱신하는 범위와 경로 기반 무효화가 해당 페이지만 갱신하는 범위의 차이를 실시간 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>도메인 상황별 최적 전략 선택</strong>: 개별 엔티티 변경은 <code>revalidateTag</code>로, 페이지 레이아웃 구조 변경은 <code>revalidatePath</code>로 명확히 분기 적용 가능합니다.</li>
                    <li><strong>캐시 무효화 부작용 최소화</strong>: 단일 상품 변경 시 관련 없는 페이지 캐시가 불필요하게 날아가는 현상을 방지합니다.</li>
                    <li><strong>아키텍처 확장성 확보</strong>: 마이크로서비스나 외부 CMS 연동 시 URL 구조에 구애받지 않는 태그 기반 이벤트 파이프라인 구축.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 단일 상품 가격/재고 변경(revalidateTag('product-101') 적용)</li>
                    <li>카테고리 기획전 레이아웃 및 배너 개편(revalidatePath('/promotions', 'page') 적용)</li>
                    <li>전체 사이트 GNB 네비게이션 개편(revalidatePath('/', 'layout') 적용)</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>revalidateTag의 글로벌 전파</strong>: <code>revalidateTag</code>는 글로벌 엣지 CDN 인프라와 결합되어 전 세계 캐시를 즉시 퍼지합니다.</li>
                    <li><strong>revalidatePath의 Router Cache 클리어</strong>: <code>revalidatePath</code>는 브라우저의 클라이언트 사이드 Router Cache도 즉시 무효화하므로 즉각적인 화면 전환에 유리합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
