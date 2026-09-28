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

  const defaultExpected = "• server-only 패키지를 통한 클라이언트 번들 유출 차단의 동작과 기대 결과를 확인합니다."
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
        title="server-only 패키지를 통한 클라이언트 번들 유출 차단 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="server-only 패키지를 통한 클라이언트 번들 유출 차단">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>server-only</code> 패키지는 데이터베이스 연결 로직, 암호화 알고리즘, 내부 비즈니스 쿼리가 포함된 서버 전용 모듈 상단에 선언하여, 클라이언트 컴포넌트(<code>'use client'</code>)에서 임포트될 경우 빌드 시점에 즉시 컴파일 에러를 발생시키는 보안 빌드 가드입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>이 데모의 <code>lib/orderSyncSecret.ts</code> 최상단에 실제로 <code>import 'server-only'</code>가 선언되어 있습니다. "빌드 타임 에러"는 클라이언트 컴포넌트가 실제로 이 파일을 import해야만 재현되는데, 그러면 이 페이지 자체가 빌드에 실패해 서비스할 수 없으므로 브라우저에서 직접 재연할 수 없습니다. 대신 [클라이언트 번들 스캔] 버튼이 <code>server-only</code>가 실제로 보장하는 결과 — "이 페이지가 브라우저로 내려보낸 모든 JS 청크 안 어디에도 시크릿 문자열이 없다" — 를 직접 검증합니다: 현재 문서의 모든 <code>&lt;script&gt;</code> 청크를 다시 <code>fetch()</code>해 텍스트를 검사합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>빌드 타임 사전 차단(Zero Bundle Leak)</strong>: 런타임 에러가 발생하기 전에 빌드 파이프라인에서 클라이언트 번들 오염을 100% 감지하여 배포를 차단합니다.</li>
              <li><strong>서버 전용 라이브러리 경량화</strong>: 무거운 Node.js 전용 패키지(예: <code>pg</code>, <code>prisma</code>, <code>crypto</code>)가 클라이언트 JS 청크에 포함되어 번들 크기가 비대해지는 현상을 방지합니다.</li>
              <li><strong>개발팀 코드 리뷰 자동화</strong>: 아키텍처 규칙 위반을 린터나 수동 리뷰 대신 프레임워크 빌더가 자동으로 검증합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>Prisma/Drizzle/Kysely 등 ORM 및 데이터베이스 직접 연결 모듈 보호</li>
              <li>결제사 서명 생성 및 비밀키 암복호화 유틸리티 모듈</li>
              <li>내부 관리자 API 인증 토큰 발급 및 파싱 로직 파일</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>상단 임포트 위치 준수</strong>: 모듈 파일의 가장 첫 번째 줄에 <code>import 'server-only'</code>를 배치해야 모듈 로딩 즉시 가드가 평가됩니다.</li>
              <li><strong>클라이언트 전용 파일에는 client-only</strong>: 반대로 브라우저 <code>window/localStorage</code> 전용 파일이 서버에서 실행되는 것을 방지할 때는 <code>client-only</code> 패키지를 사용할 수 있습니다.</li>
              <li><strong>이 스캔이 실제로 무엇을 증명하는가</strong>: 만약 <code>lib/orderSyncSecret.ts</code>에서 <code>import 'server-only'</code>를 지우고 어떤 클라이언트 컴포넌트가 그 함수를 직접 호출하도록 바꾼다면, 시크릿 상수가 클라이언트 JS 청크 안에 문자열로 그대로 번들링되어 이 스캔이 그 청크에서 시크릿 접두사를 실제로 찾아내며 실패(불일치)로 바뀝니다. 즉 <code>server-only</code>가 없으면 이 검증이 잡아낼 수 있는 실수를, 있기 때문에 애초에 발생하지 않게(빌드 단계에서) 막아주는 것입니다.</li>
              <li><strong>스캔 범위의 한계</strong>: 이 스캔은 현재 페이지가 이미 내려받은 <code>&lt;script&gt;</code> 청크만 검사합니다. 아직 로드되지 않은(지연 로딩) 청크까지 완전히 보장하지는 않으므로, 실무에서는 이 스캔이 아니라 <code>server-only</code>의 빌드 타임 차단 자체가 1차 방어선입니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
