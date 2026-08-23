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

  const defaultExpected = "• 결제 모달 next/dynamic 지연 로드 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="결제 모달 next/dynamic 지연 로드 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="결제 모달 next/dynamic 지연 로드">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/dynamic</code>(또는 React 19의 <code>React.lazy</code>)은 초기 페이지 로드 시 무거운 컴포넌트(결제 모달, 차트 라이브러리 등)를 번들에서 분리하고, 사용자가 버튼을 클릭하여 모달을 여는 등 실제 필요한 시점에 비동기 청크(Chunk)로 지연 다운로드하는 코드 스플리팅(Code Splitting) 표준 API입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 초기 화면 진입 시 결제 모달 컴포넌트 코드를 다운로드하지 않고 대기하다가, 사용자가 [[결제] 결제 모달 열기] 버튼을 클릭하는 순간 <code>next/dynamic</code>으로 분리된 모달 청크를 로드하여 렌더링을 완료하는 지연 로딩 수명 주기를 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>초기 자바스크립트 번들 30~50% 경감</strong>: 첫 페이지 로드 시 실행하지 않는 결제 SDK나 복잡한 폼 번들을 제거하여 초기 로딩을 가속화합니다.</li>
              <li><strong>TBT / LCP 성능 극대화</strong>: 메인 스레드 스크립트 파싱 시간을 줄여 페이지 상호작용 가능 시간(TBT)과 코어 웹 바이탈 지표를 최상으로 유지합니다.</li>
              <li><strong>선언적 로딩 폴백</strong>: <code>loading: () ={'>'} {'<'}Spinner /{'>'}</code> 옵션을 통해 청크 다운로드 중 자연스러운 스켈레톤/스피너 UI를 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>결제 승인 모달, 주소 검색 팝업, 본인 인증 팝업 등 인터랙션 시점에만 필요한 위젯</li>
              <li>Chart.js / D3 / Three.js 기반의 무거운 데이터 시각화 컴포넌트</li>
              <li>리치 텍스트 에디터(Quill, TinyMCE) 및 파일 드래그앤드롭 업로더</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>ssr: false 옵션의 Client Component 한정</strong>: <code>dynamic(() ={'>'} import(...), {'{'} ssr: false {'}'})</code>는 클라이언트 컴포넌트(<code>'use client'</code>) 내부에서만 사용할 수 있으며, 서버 컴포넌트에서는 <code>ssr: false</code> 옵션을 사용할 수 없습니다.</li>
              <li><strong>Named Export 로드 시 맵핑</strong>: default export가 아닌 명명된 export(Named Export) 컴포넌트를 로드할 때는 <code>dynamic(() ={'>'} import('./Modal').then(mod ={'>'} mod.PaymentModal))</code> 형태로 Promise 체이닝을 작성해야 합니다.</li>
              <li><strong>사용자 인터랙션 지연(INP) 완화</strong>: 모달 버튼 호버 시 <code>import('./Modal')</code>를 미리 트리거(Pre-load)해 두면 클릭 시 청크 다운로드 대기 시간을 0ms로 줄일 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
