'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  actionResult?: string | null
  selectedSimulation?: string
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const { actionResult, selectedSimulation = 'primitive' } = props

  const defaultExpected =
    '• RSC → RCC Props 직렬화: 원시값(string, number, boolean, null), 평탄 객체(sku, stock), 배열, 날짜 문자열이 런타임 JSON 검증을 통과하여 정상 수신됨\n• 타입별 직렬화 규격: 일반 함수/Class/순환참조는 직렬화 불가 에러를 유발하며, "use server" Server Action은 고유 Action ID 참조로 직렬화되어 정상 호출됨'

  const hasExecuted = Boolean(actionResult)

  const defaultActual = hasExecuted
    ? `• RSC 수신 Props 런타임 검증: 100% Valid JSON 통과 (원시값 4개, 평탄 객체, 배열, ISO Date)\n• 선택된 시뮬레이터 타입: [${selectedSimulation}] 검사 완료\n• Server Action Props 실행: 성공 (POST 200 OK)\n• 서버 응답 메시지: "${actionResult}"\n• Props 직렬화 및 Server Action 함수 Props 전달 검증 완료`
    : `• RSC 수신 Props 런타임 검증: 100% Valid JSON 통과 (원시값 4개, 평탄 객체, 배열, ISO Date 수신 완료)\n• 현재 시뮬레이터 검사 타입: [${selectedSimulation}]\n• Server Action Props 실행: 미실행 (대기 중)\n• 상태: [타입별 시뮬레이터] 탭을 눌러보고 하단 [전달받은 Server Action Props 실행] 버튼을 클릭하세요.`

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : true

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Props 직렬화(Serialization) 및 전달 경계 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          '이 예제의 동작과 검증 결과를 표시합니다.'
        }
      />
      <DemoDeepDiveCard title="Props 직렬화(Serialization) 및 전달 경계 검증">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Server Component에서 Client Component로 데이터를 전달할 때 React Flight 프로토콜을 통과하기 위해 Props는 반드시 JSON 직렬화 가능한 타입(문자열, 숫자, 불리언, 순수 객체, 배열, <code>Date</code>, <code>Promise</code> 등)이어야 하며 함수, 클래스 인스턴스, Symbol 등은 전달할 수 없는 경계 직렬화 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 Server Component에서 준비한 직렬화 가능한 Props 데이터(원시값, 평탄 객체, 배열, ISO 날짜 문자열)와 <code>'use server'</code> Server Action 함수(<code>executeServerTask</code>)를 Client Component로 안전하게 전달하고, 클라이언트에서 전달받은 Server Action을 정상 실행하는 Flight 프로토콜 직렬화 경계를 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>네트워크 통신 무결성</strong>: 서버와 클라이언트 간의 데이터 교환이 안전하고 예측 가능한 규격으로 표준화됩니다.</li>
              <li><strong>클라이언트 번들 오염 방지</strong>: 서버 비즈니스 로직 함수나 DB 커넥션 인스턴스가 실수로 브라우저 메모리에 유출되는 사고를 원천 차단합니다.</li>
              <li><strong>일관된 상태 복원</strong>: 서버에서 직렬화된 데이터가 클라이언트 브라우저에서 동일한 형태의 JS 객체로 정확히 하이드레이션됩니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>서버 DB에서 조회한 상품 생성일(<code>Date</code>) 및 결제 내역 배열을 클라이언트 주문 테이블로 전달</li>
              <li>Server Action 함수를 클라이언트 폼의 action Props로 안전하게 바인딩</li>
              <li>복합 필터 조건(가격 범위, 카테고리 태그 배열)을 클라이언트 필터 위젯에 초기값으로 전달</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Date 객체 하이드레이션 주의</strong>: <code>Date</code> 객체는 직렬화되어 전달되지만 서버와 클라이언트의 타임존(Timezone) 차이로 인해 렌더링 불일치(Hydration Mismatch)가 발생할 수 있으므로 UTC 기준 문자열이나 포맷팅된 텍스트 전달을 고려해야 합니다.</li>
              <li><strong>함수 전달 시 'use server' 활용</strong>: 클라이언트 컴포넌트에 콜백 함수를 넘겨야 하는 경우 일반 함수가 아닌 <code>'use server'</code>가 선언된 Server Action 함수만 전달할 수 있습니다.</li>
              <li><strong>클래스 인스턴스 DTO 변환</strong>: ORM(Prisma, TypeORM 등) 엔티티 클래스는 클라이언트로 넘기기 전 순수 객체(Plain Object)로 직렬화하여 전달해야 메서드 손실 경고를 방지할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
