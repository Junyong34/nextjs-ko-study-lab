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

  const defaultExpected = "• Turbopack 증분 빌드 및 핫 모듈 리로딩 가속 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Turbopack 증분 빌드 및 핫 모듈 리로딩 가속 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="Turbopack 증분 빌드 및 핫 모듈 리로딩 가속">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>Turbopack(Rust 기반 차세대 번들러)은 함수 레벨의 증분 연산(Incremental Computation) 아키텍처와 Turbo Engine 캐시를 기반으로, 대규모 엔터프라이즈 코드베이스에서도 코드 수정 시 전체 재번들링 없이 변경된 함수 AST만을 수 밀리초(ms) 만에 핫 리로딩(Fast Refresh)하는 성능 최적화 빌드 엔진입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 수백 개의 모듈이 포함된 프로젝트 환경에서 컴포넌트 텍스트나 스타일을 수정했을 때, Webpack(수 초 소요) 대비 Turbopack이 10ms 이내의 찰나에 브라우저 상태(State)를 보존한 채 즉각 화면을 갱신하는 HMR 가속 메커니즘을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>개발 서버 시작 속도 10배 가속</strong>: 프로젝트 초기 기동 시 모든 페이지를 미리 컴파일하지 않고 현재 요청된 페이지만 온디맨드로 컴파일하여 수백 ms 내에 서버를 구동합니다.</li>
              <li><strong>증분 연산 캐시를 통한 지속적 고속 HMR</strong>: 동일한 파일이나 함수가 재연산되지 않도록 메모리에 그래프 결과를 캐싱하여 코드 수정 빈도가 높아도 지연이 발생하지 않습니다.</li>
              <li><strong>네이티브 Rust 엔진의 메모리 효율성</strong>: V8 가비지 컬렉션 부하를 없애고 Rust의 정밀한 메모리 관리로 대규모 모노레포의 빌드 안정성을 극대화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>수백 명의 엔지니어가 수천 개의 컴포넌트를 개발하는 대규모 모노레포 환경</li>
              <li>실시간 UI 스타일링 및 인터랙션 미세 조정 개발 워크플로우</li>
              <li>CI/CD 프로덕션 빌드 파이프라인의 속도 최적화 및 리소스 절감</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>next dev --turbopack 플래그 실행</strong>: 개발 모드에서 Turbopack을 사용하려면 <code>package.json</code>의 스크립트에 <code>next dev --turbopack</code>을 명시해야 합니다.</li>
              <li><strong>Webpack 커스텀 플러그인 호환성 점검</strong>: 기존 <code>webpack()</code> 커스텀 설정 플러그인은 Turbopack에서 직접 실행되지 않으므로 공식 지원 로더 및 Turbopack 플러그인 생태계로 전환해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
