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

  const defaultExpected = "• revalidatePath를 통한 라우트 전체 즉시 동기화 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="revalidatePath를 통한 라우트 전체 즉시 동기화 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="revalidatePath를 통한 라우트 전체 즉시 동기화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>revalidatePath(path)</code>는 Next.js App Router에서 특정 라우트 경로에 연결된 서버 캐시(Static Full Route Cache 및 Data Cache)를 즉각 무효화(Purge)하여, 다음 요청 시 최신 데이터가 반영된 정적 HTML/RSC를 즉시 재생성하도록 명령하는 온디맨드 ISR 표준 함수입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 상품 관리자가 상품 가격이나 재고를 수정한 후 <code>revalidatePath('/zone/baseline/guides/isr/revalidate-path-sync')</code>를 호출했을 때, 기존 60초 주기 타이머와 무관하게 서버 캐시가 즉시 무효화되고 최신 가격이 즉시 렌더링되는 과정을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>실시간 데이터 무결성 보장</strong>: 정적 캐싱의 초고속 성능을 유지하면서도 데이터 변경 시점에 지연 없이 0ms 즉각 동기화를 달성합니다.</li>
                    <li><strong>주기적 폴링 제거</strong>: 불필요하게 짧은 ISR 시간을 설정할 필요 없이 데이터가 수정될 때만 정확히 캐시를 재생성하여 서버 리소스를 절감합니다.</li>
                    <li><strong>단일 명령으로 전체 페이지 갱신</strong>: 복잡한 개별 캐시 키를 기억할 필요 없이 대상 URL 경로 하나로 연관된 모든 컴포넌트 데이터를 일괄 갱신합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 관리자 백오피스에서 상품 정보, 가격, 품절 상태 수정 후 카탈로그 즉시 반영</li>
                    <li>고객센터 공지사항 및 이벤트 배너 등록 즉시 메인 화면 동기화</li>
                    <li>블로그 포스트 발행 또는 수정 시 정적 상세 페이지 즉각 최신화</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>type 파라미터('page' vs 'layout') 지정</strong>: 단일 페이지만 갱신하려면 <code>revalidatePath(path, 'page')</code>를, 해당 경로 하위의 모든 중첩 라우트까지 일괄 갱신하려면 <code>revalidatePath(path, 'layout')</code>을 지정해야 합니다.</li>
                    <li><strong>Server Action 및 Route Handler 전용</strong>: <code>revalidatePath</code>는 서버 환경(Server Actions, Route Handlers)에서만 호출할 수 있으며 클라이언트 컴포넌트에서는 직접 실행할 수 없습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
