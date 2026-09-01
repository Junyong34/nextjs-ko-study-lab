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

  const defaultExpected = '• 호버 전후 정적 셸 표시 상태와 production Network 요청을 확인합니다.'
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
        title="링크 호버 시 정적 셸 표시 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="Partial Prefetching과 호버 상태 표시">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Partial Prerendering(PPR)과 Partial Prefetching은 정적 셸과 동적 콘텐츠를 나누어 준비하는 방식입니다. 이 화면은 호버 상태를 표시하며, 실제 prefetch 요청은 production 환경의 Network 탭에서 확인해야 합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>이 화면에서는 [상품 카드 링크]에 마우스를 올리면 정적 셸 표시 상태가 바뀝니다. 실제 prefetch 요청과 클릭 뒤의 데이터 요청은 production 환경의 Network 탭에서 확인합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>정적 셸과 동적 콘텐츠 구분</strong>: 먼저 준비할 화면과 나중에 요청할 데이터를 나누어 생각할 수 있습니다.</li>
                    <li><strong>Network 탭으로 동작 확인</strong>: 호버와 클릭 뒤 실제 요청이 언제 발생하는지 확인할 수 있습니다.</li>
                    <li><strong>환경별 차이 이해</strong>: 개발 모드와 production 빌드에서 prefetch 동작이 다를 수 있음을 확인합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>수만 개의 상품이 노출되는 대형 쇼핑몰 메인 카탈로그 그리드</li>
                    <li>모바일 웹 환경의 하단 네비게이션 탭 및 카테고리 퀵 메뉴</li>
                    <li>트래픽이 집중되는 타임세일 이벤트 프로모션 랜딩 페이지</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>실제 요청 확인</strong>: prefetch 동작을 판단할 때는 화면 변화만 보지 말고 production Network 탭의 요청을 확인해야 합니다.</li>
                    <li><strong>loading.tsx와의 조화</strong>: 정적 셸에 명확한 Suspense 스켈레톤 영역이 정의되어 있어야 동적 데이터 수신 시 레이아웃 흔들림이 발생하지 않습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
