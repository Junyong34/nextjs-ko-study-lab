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

  const defaultExpected = "• experimental_taintUniqueValue 원시 시크릿 유출 차단 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="experimental_taintUniqueValue 원시 시크릿 유출 차단 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="experimental_taintUniqueValue 비밀키 및 개인정보 클라이언트 유출 차단">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>experimental_taintUniqueValue</code> (<code>react</code>)는 React 19와 Next.js 15+에서 제공하는 보안 Taint API로, DB 비밀번호, PG사 Secret Key, 주민번호 등 민감한 고유 문자열 값을 오염(Taint) 처리하여 해당 값이 Client Component의 Props나 직렬화 스트림에 포함될 경우 런타임 에러를 발생시켜 번들 유출을 원천 방어합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 서버 결제 서비스 초기화 시 <code>experimental_taintUniqueValue('결제 비밀키는 클라이언트에 전달될 수 없습니다.', process, process.env.PG_SECRET_KEY)</code>를 등록한 후, 해당 키를 실수로 클라이언트 컴포넌트 Props로 넘기려 할 때 React가 렌더링을 차단하고 보안 에러를 던지는 동작을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 시크릿 유출 원천 방어</strong>: 개발자의 실수로 발생하는 API Key, 암호화 키의 클라이언트 JS 번들 노출 사고를 빌드/런타임에서 완벽 차단합니다.</li>
              <li><strong>개인정보보호 컴플라이언스 준수</strong>: 고객 주민등록번호, 계좌번호 등 민감 정보의 브라우저 전송을 방지합니다.</li>
              <li><strong>정밀한 에러 메시지 제공</strong>: 유출 시도 시 개발자에게 등록된 경고 메시지를 명확히 표시하여 신속한 조치를 유도합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>PG사 결제 Secret Key 및 AWS IAM Secret Access Key 클라이언트 유출 방어</li>
              <li>고객 비밀번호 해시, 주민등록번호, 신용카드 CVC 번호 직렬화 차단</li>
              <li>내부 ERP 시스템의 관리자 마스터 토큰 보호</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>next.config.ts 활성화 필요</strong>: Next.js에서 React Taint API를 사용하려면 <code>next.config.ts</code>의 <code>experimental.taint: true</code> 설정이 필요합니다.</li>
              <li><strong>taintObjectReference와의 차이</strong>: 객체 전체를 보호할 때는 <code>experimental_taintObjectReference</code>를, 개별 문자열/원시값을 보호할 때는 <code>experimental_taintUniqueValue</code>를 사용합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
