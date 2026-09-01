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

  const defaultExpected = "• Props 직렬화 경계 및 안전한 전달의 동작과 기대 결과를 확인합니다."
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
        title="Props 직렬화 경계 및 안전한 전달 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="Props 직렬화 경계 및 Flight 페이로드 검증">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>React Server Components에서 Client Component로 Props를 전달할 때 React Flight 프로토콜을 통과하기 위해 데이터는 반드시 직렬화(Serialization) 가능한 형태여야 하며, 함수, 클래스 인스턴스, Symbol, 비직렬화 객체는 경계를 넘을 수 없도록 엄격히 통제하는 표준 직렬화 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 서버에서 생성된 상품 주문 JSON 데이터, <code>Date</code> 객체, BigInt, 함수 전달 시도를 각각 테스트하여, Flight 프로토콜이 직렬화 가능 여부를 판별하고 클라이언트로 안전하게 역직렬화(Deserialization)하는 과정을 실시간 검증 패널로 확인합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>서버 메모리 객체 유출 차단</strong>: DB 커넥션 풀 인스턴스나 백엔드 내부 클래스 메서드가 브라우저로 누출되는 보안 사고를 원천 차단합니다.</li>
                    <li><strong>네트워크 전송 무결성</strong>: JSON 기반의 Flight 프로토콜을 통해 서버와 클라이언트 간의 데이터 구조가 손상 없이 동기화됩니다.</li>
                    <li><strong>타입 안전성 보장</strong>: TypeScript 인터페이스와 직렬화 규칙을 결합하여 런타임 에러를 사전에 방지합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>서버 DB에서 조회한 결제 내역 및 주문 일자(<code>Date</code>)를 클라이언트 테이블 위젯으로 전달</li>
                    <li>Server Action 함수를 클라이언트 폼의 action Props로 안전하게 바인딩</li>
                    <li>대용량 상품 메타데이터 객체의 정제된 DTO 클라이언트 전송</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Date 객체의 타임존 차이</strong>: <code>Date</code> 객체는 직렬화되어 전달되지만 서버와 클라이언트의 시간대(Timezone) 설정에 따라 텍스트 표기가 달라질 수 있으므로 ISO 문자열 포맷팅 전달을 권장합니다.</li>
                    <li><strong>Server Actions의 예외적 전달</strong>: 함수는 일반적으로 Props로 전달할 수 없으나, <code>'use server'</code>가 선언된 Server Action 함수는 암호화된 Action ID 참조자로 안전하게 직렬화되어 전달 가능합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
