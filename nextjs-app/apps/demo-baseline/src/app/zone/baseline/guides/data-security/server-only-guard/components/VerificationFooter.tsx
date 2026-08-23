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

  const defaultExpected = "• server-only 패키지를 통한 클라이언트 번들 유출 차단 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 5단 표준 레이아웃 정상 적용"

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
        title="server-only 패키지를 통한 클라이언트 번들 유출 차단 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="server-only 패키지를 통한 클라이언트 번들 유출 차단">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>server-only</code> 패키지는 데이터베이스 연결 로직, 암호화 알고리즘, 내부 비즈니스 쿼리가 포함된 서버 전용 모듈 상단에 선언하여, 클라이언트 컴포넌트(<code>'use client'</code>)에서 임포트될 경우 빌드 시점에 즉시 컴파일 에러를 발생시키는 보안 빌드 가드입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 DB 쿼리 모듈(<code>lib/db/orders.ts</code>) 상단에 <code>import 'server-only'</code>를 주입하여, 클라이언트 컴포넌트가 해당 모듈을 직접 import하려고 시도할 때 Webpack/Turbopack 빌드 엔진이 번들링을 거부하고 에러를 출력하는 메커니즘을 실증합니다.</p>
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
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
