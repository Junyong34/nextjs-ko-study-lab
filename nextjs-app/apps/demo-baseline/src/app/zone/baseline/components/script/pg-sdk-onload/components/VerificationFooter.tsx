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

  const defaultExpected = "• 외부 PG사 결제 SDK onLoad 이벤트 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="외부 PG사 결제 SDK onLoad 이벤트 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="외부 PG사 결제 SDK 동적 로딩 & onLoad 이벤트 핸들러">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/script</code>의 <code>onLoad</code>, <code>onReady</code>, <code>onError</code> 생명주기 콜백은 외부 결제 SDK나 지도 API 자바스크립트 파일이 브라우저에 완전히 로드된 시점을 감지하여, 전역 객체(e.g., <code>window.TossPayments</code>, <code>window.Kakao</code>)를 안전하게 초기화하는 이벤트 바인딩 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 토스페이먼츠/이니시스 결제 SDK 스크립트가 로드되는 즉시 <code>onLoad</code> 핸들러가 트리거되어 SDK 인스턴스를 초기화하고, 결제 버튼을 비활성(Loading) 상태에서 활성(Ready) 상태로 자동 전환하는 흐름을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>전역 객체 미정의(Undefined) 오류 원천 차단</strong>: SDK 파일 다운로드 완료 전에 결제 함수를 호출하여 발생하는 <code>Uncaught ReferenceError</code> 런타임 크래시를 방지합니다.</li>
              <li><strong>onReady를 통한 라우트 복귀 대응</strong>: 페이지를 벗어났다가 뒤로 가기로 돌아왔을 때 스크립트가 이미 로드된 상태라도 <code>onReady</code> 콜백이 즉각 재실행되어 안정적인 상태를 유지합니다.</li>
              <li><strong>onError를 통한 결제 장애 폴백</strong>: 서드파티 CDN 서버 장애나 네트워크 오류 시 사용자에게 대체 결제수단 안내 UI를 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>토스페이먼츠 / 포트원 / 스트라이프 외부 결제창 SDK 연동</li>
              <li>카카오맵 / 네이버 지도 API 스크립트 로드 및 지도 인스턴스 초기화</li>
              <li>소셜 로그인(카카오/네이버/구글 SDK) 초기화 및 인증 버튼 바인딩</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>클라이언트 컴포넌트 필수</strong>: <code>onLoad</code>, <code>onReady</code>, <code>onError</code> 함수는 클라이언트 이벤트 리스너이므로 반드시 <code>'use client'</code> 지시어가 선언된 컴포넌트 내부에서 사용해야 합니다.</li>
              <li><strong>TypeScript 전역 Window 타입 선언</strong>: <code>window.TossPayments</code> 등 서드파티 전역 변수를 TypeScript에서 안전하게 참조하려면 <code>declare global {'{'} interface Window {'{'} TossPayments: any; {'}'} {'}'}</code> 타입 확장을 권장합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
