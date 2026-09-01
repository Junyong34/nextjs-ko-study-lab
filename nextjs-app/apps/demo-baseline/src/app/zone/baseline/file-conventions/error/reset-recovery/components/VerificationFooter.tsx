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

  const defaultExpected = "• error.tsx reset() 컴포넌트 재시도 복구의 동작과 기대 결과를 확인합니다."
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
        title="error.tsx reset() 컴포넌트 재시도 복구 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="error.tsx reset() 컴포넌트 재시도 복구 및 서버 데이터 재동기화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>error.tsx</code>의 <code>reset()</code> 함수는 React Error Boundary의 내부 에러 상태를 초기화하고 현재 라우트 세그먼트의 렌더링을 다시 시도(Re-render)하는 Next.js 표준 복구 메서드입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 일시적인 네트워크 불안정으로 상품 상세 정보 로딩이 실패하여 <code>error.tsx</code> 바운더리가 활성화된 후, 사용자가 [다시 시도] 버튼을 클릭하면 <code>reset()</code>이 실행되어 에러 상태를 해제하고 정상 데이터를 다시 페치하여 화면을 복구하는 수명 주기를 실증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>클라이언트 측 무중단 복구</strong>: 브라우저 전체 새로고침 없이 실패한 서브트리만 부분 재실행하여 매끄러운 사용자 경험을 보장합니다.</li>
              <li><strong>폼 입력 상태 및 스크롤 보존</strong>: 다른 탭이나 상위 레이아웃의 상태를 잃지 않고 문제 영역만 선별 복구합니다.</li>
              <li><strong>재시도 횟수 제한 및 대체 UX 제공</strong>: 재시도 실패 시 고객센터 문의 링크나 대체 결제 수단 안내로 전환할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>모바일 불안정 네트워크 환경에서의 상품 상세 조회 재시도</li>
              <li>실시간 주식/환율/코인 시세 스트리밍 일시 연결 끊김 복구</li>
              <li>대용량 파일 업로드 중 타임아웃 발생 시 청크 재전송</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 컴포넌트 에러 복구 시 router.refresh() 필수</strong>: 서버 컴포넌트에서 throw된 에러는 클라이언트 <code>reset()</code>만으로는 서버 데이터를 다시 가져오지 않을 수 있으므로, 반드시 <code>startTransition(() ={'>'} {'{'} router.refresh(); reset(); {'}'})</code> 패턴으로 서버 데이터를 새로고침해야 합니다.</li>
              <li><strong>무한 루프 방어</strong>: 복구 불가능한 영구 에러(예: 404, 권한 없음)에서 무조건 <code>reset()</code>만 반복 호출하면 무한 에러 루프가 발생할 수 있으므로 에러 타입별 분기 처리가 필요합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
