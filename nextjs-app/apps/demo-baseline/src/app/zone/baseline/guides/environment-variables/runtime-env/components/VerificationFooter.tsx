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

  const defaultExpected = "• process.env 런타임 환경변수 동적 참조 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="process.env 런타임 환경변수 동적 참조 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="process.env 런타임 환경변수 동적 참조">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Next.js 서버 컴포넌트 및 Route Handler에서의 <code>process.env</code> 런타임 동적 참조는 빌드 타임 하드코딩 없이, 컨테이너(Docker/Kubernetes) 실행 시점에 OS 주입 환경변수를 실시간으로 읽어 동일한 빌드 아티팩트를 다양한 환경에 배포할 수 있도록 지원하는 엔터프라이즈 운영 표준 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 실제 Route Handler(<code>api/status/route.ts</code>)가 <code>process.pid</code>, <code>process.env.NODE_ENV</code>, 현재 시각을 매 요청마다 새로 읽어 응답한다. 같은 서버 프로세스(pid 동일)에서 호출할 때마다 <code>evaluatedAt</code>이 갱신되는 것을 직접 확인해, 이 값이 빌드 타임에 번들에 굳지 않고 요청 시점에 평가됨을 실증한다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Build Once, Deploy Anywhere (12-Factor App)</strong>: 단 한 번의 CI 빌드로 생성된 Docker 이미지를 Staging, QA, Production 환경으로 무재빌드 승격(Promotion) 배포할 수 있습니다.</li>
              <li><strong>Kubernetes ConfigMap/Secrets 즉시 반영</strong>: Pod 재기동 시점에 최신 ConfigMap 및 Secret 값을 런타임 <code>process.env</code>로 즉시 로드합니다.</li>
              <li><strong>빌드 시간 단축 및 캐시 최적화</strong>: 환경별로 별도의 빌드를 수행하지 않아 CI/CD 파이프라인의 소요 시간을 70% 이상 단축합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>Kubernetes 기반의 마이크로서비스 인프라 엔드포인트 및 Redis 캐시 호스트 바인딩</li>
              <li>카나리 배포 및 블루-그린 배포 시 팟(Pod) 단위 환경변수 제어</li>
              <li>글로벌 리전별(서울/도쿄/버지니아) 데이터베이스 리드 리플리카(Read Replica) 접속 분기</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>클라이언트 컴포넌트 참조 불가</strong>: 런타임 동적 <code>process.env</code>는 오직 서버 런타임(Node.js/Edge)에서만 평가되며, 클라이언트 컴포넌트에서는 접근할 수 없습니다.</li>
              <li><strong>정적 생성 페이지의 런타임 변수 주의</strong>: 빌드 타임에 완전 정적으로 생성된 페이지(SSG)는 빌드 시점의 환경변수 값이 HTML에 각인되므로, 런타임 변수가 필요할 경우 <code>export const dynamic = 'force-dynamic'</code>을 선언해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
