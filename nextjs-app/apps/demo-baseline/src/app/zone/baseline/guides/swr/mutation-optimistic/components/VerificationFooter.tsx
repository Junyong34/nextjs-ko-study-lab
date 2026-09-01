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

  const defaultExpected = "• SWR mutate()를 활용한 낙관적 장바구니 갱신의 동작과 기대 결과를 확인합니다."
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
        title="SWR mutate()를 활용한 낙관적 장바구니 갱신 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="SWR mutate() 낙관적 장바구니 업데이트 & 롤백">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>SWR의 <code>mutate(key, asyncUpdate, {'{'} optimisticData, rollbackOnError, revalidate {'}'})</code> API는 서버 API 응답을 기다리지 않고 클라이언트 캐시를 예상 성공 데이터로 즉시 치환(Optimistic Update)한 뒤, 백그라운드 서버 요청이 실패할 경우 이전 캐시 상태로 자동 롤백하는 표준 클라이언트 캐시 변이 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 장바구니 수량 변경 시 <code>mutate('/api/cart', updateFn, {'{'} optimisticData: nextCart, rollbackOnError: true {'}'})</code>를 실행하여 0ms 만에 UI를 갱신하고, 네트워크 실패 시뮬레이션 활성화 시 에러 알림과 함께 이전 수량으로 자연스럽게 롤백되는 과정을 시각화합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>0ms 인터랙션 반응성</strong>: 클라이언트 캐시를 선제적으로 수정하여 네트워크 지연에 구애받지 않는 즉각적인 쇼핑 UX를 제공합니다.</li>
                    <li><strong>자동 에러 롤백 보장</strong>: 수동 롤백 상태 관리 코드 없이 SWR이 원본 캐시 스냅샷을 기반으로 안전하게 원복합니다.</li>
                    <li><strong>최종 서버 데이터 자동 정합성 맞춤</strong>: 변이 완료 후 <code>revalidate: true</code> 옵션을 통해 서버의 최신 실제 데이터로 최종 정합성을 자동 검증합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>장바구니 수량 변경(+/-) 및 상품 삭제 즉시 반영</li>
                    <li>게시글 좋아요/북마크 토글 및 실시간 카운트 증감</li>
                    <li>할인 쿠폰 적용 시 결제 예정 금액 즉각 할인 계산</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>populateCache 옵션 활용</strong>: 서버 API가 변경된 전체 최신 데이터를 반환하는 경우 <code>populateCache: true</code>와 <code>revalidate: false</code>를 설정하여 불필요한 추가 GET 조회를 생략할 수 있습니다.</li>
                    <li><strong>낙관적 데이터 불변성 유지</strong>: <code>optimisticData</code>에 전달하는 객체는 기존 캐시 원본을 직접 수정하지 않고 불변성(Immutability)을 유지하여 새 복사본을 전달해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
