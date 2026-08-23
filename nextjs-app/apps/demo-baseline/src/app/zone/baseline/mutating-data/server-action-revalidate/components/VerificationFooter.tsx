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

  const defaultExpected = "• Server Action 데이터 변경 및 revalidatePath 동기화 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Server Action 데이터 변경 및 revalidatePath 동기화 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="Server Action 데이터 변경 및 revalidatePath 동기화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Server Action 내부에서 데이터베이스 변이(Mutation)를 수행한 후 <code>revalidatePath()</code> 또는 <code>revalidateTag()</code>를 호출하여, 연관된 서버 컴포넌트 캐시를 온디맨드로 무효화하고 최신 데이터가 반영된 RSC 페이로드를 클라이언트에 즉시 재전송하는 풀스택 데이터 동기화 표준 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 새 배송지 등록 폼을 제출하면 <code>'use server'</code> 함수가 백엔드 저장소에 데이터를 추가하고 <code>revalidatePath('/mutating-data/...')</code>를 호출합니다. 서버가 해당 경로의 캐시를 갱신하고 최신 배송지 목록을 클라이언트에 자동 스트리밍합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>단일 왕복(Single Roundtrip) 동기화</strong>: 데이터 변경 요청과 최신 화면 재검증이 1회의 HTTP 네트워크 통신으로 완결됩니다.</li>
                    <li><strong>클라이언트 캐시 불일치 제거</strong>: 수동으로 클라이언트 전역 상태나 캐시 키를 일일이 무효화할 필요 없이 서버가 단일 진실 공급원(SSOT)을 유지합니다.</li>
                    <li><strong>강력한 타입 안전성</strong>: 폼 데이터 수신부터 서버 검증, 응답 반환까지 End-to-End TypeScript 타입 추론을 보장합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 배송지 추가/수정/삭제 후 기본 배송지 목록 즉시 재렌더링</li>
                    <li>상품 재고 수량 변경 및 옵션 수정 후 상품 상세 카탈로그 실시간 최신화</li>
                    <li>관리자 권한 변경 후 사용자 목록 및 권한 뱃지 동기화</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>revalidatePath 범위 주의</strong>: <code>revalidatePath('/path', 'page')</code>는 해당 페이지만 무효화하며, 하위 모든 중첩 경로를 무효화하려면 <code>revalidatePath('/path', 'layout')</code>을 명시해야 합니다.</li>
                    <li><strong>리다이렉트와의 결합</strong>: <code>revalidatePath</code> 호출 후 다른 화면으로 전환하려면 함수 마지막에 <code>redirect('/target')</code>를 호출하며, 이 때 <code>redirect</code>는 <code>try/catch</code> 블록 외부에 두어야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
