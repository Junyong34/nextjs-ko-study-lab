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

  const defaultExpected = "• 온디맨드 캐시 무효화와 상태 갱신의 동작과 기대 결과를 확인합니다."
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
        title="온디맨드 캐시 무효화와 상태 갱신 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="Server Action 기반 온디맨드 revalidation 동기화 수명 주기">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>온디맨드 revalidation(On-Demand Revalidation)은 사용자의 데이터 변경 액션(Server Action) 직후 <code>revalidateTag()</code> 또는 <code>revalidatePath()</code>를 트리거하여, 서버의 Data Cache와 CDN 캐시를 즉시 만료시키고 최신 RSC 페이로드를 단일 네트워크 왕복 내에서 클라이언트에 동기화하는 수명 주기 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 [상품 옵션 변경] 폼 제출 시 Server Action 실행 -{'>'} DB 업데이트 -{'>'} <code>revalidateTag('product-options')</code> 실행 -{'>'} 최신 RSC 스트림 수신 -{'>'} 클라이언트 UI 갱신으로 이어지는 5단계 동기화 라이프사이클을 실시간 타임라인으로 대조 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>단일 네트워크 요청 완결</strong>: 데이터 변이(POST)와 변경된 화면 데이터 수신이 1회의 HTTP 왕복으로 처리되어 네트워크 핑퐁을 제거합니다.</li>
                    <li><strong>클라이언트 상태 관리 부담 제로</strong>: Redux나 Zustand에 복잡한 서버 데이터 캐시를 복사해둘 필요 없이 서버가 항상 최신 상태를 제공합니다.</li>
                    <li><strong>다중 기기 동시성 보장</strong>: 모바일 앱이나 다른 PC 브라우저에서 변경한 내용도 서버 캐시가 즉시 퍼지되어 모든 클라이언트에 최신 데이터가 보장됩니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>장바구니 담기 후 상단 미니 장바구니 카운트 즉시 동기화</li>
                    <li>주문 배송지 변경 후 주문서 화면의 기본 배송지 텍스트 갱신</li>
                    <li>상품 Q&A 등록 후 질문 목록 즉각 업데이트</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>트랜잭션 순서 엄수</strong>: 반드시 데이터베이스 저장이 성공적으로 커밋(Commit)된 후에 <code>revalidateTag</code>를 호출해야 DB 롤백 시 잘못된 캐시 무효화가 발생하는 것을 방지할 수 있습니다.</li>
                    <li><strong>낙관적 UI(useOptimistic)와의 조화</strong>: 초기 반응성은 <code>useOptimistic</code>으로 0ms 처리하고, 최종 서버 정합성은 온디맨드 revalidation으로 맞추는 것이 이상적입니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
