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

  const defaultExpected = "• experimental.staleTimes 클라이언트 라우터 캐시 시간 제어의 동작과 기대 결과를 확인합니다."
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
        title="experimental.staleTimes 클라이언트 라우터 캐시 시간 제어 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                                    <DemoDeepDiveCard title="staleTimes 설정을 통한 클라이언트 Router Cache 튜닝">
                    <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                        <p><code>next.config.ts</code>의 <code>experimental.staleTimes</code> 옵션은 클라이언트 브라우저 메모리에 유지되는 App Router 캐시(Router Cache)의 정적(<code>static</code>) 및 다이나믹(<code>dynamic</code>) 세그먼트 유지 시간(초)을 조정합니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                        <p>이 예제에서는 <code>staleTimes: {'{'} dynamic: 30, static: 180 {'}'}</code> 설정에 따라 다이나믹 라우트 이동 후 30초 이내에 뒤로가기를 하면 캐시된 화면을 복원하고, 30초가 지나면 서버에 최신 RSC를 다시 요청하는 흐름을 확인합니다.</p>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>불필요한 클라이언트 재요청 절감</strong>: 사용자가 메뉴 탭을 오갈 때 발생하는 반복적인 RSC 요청을 줄일 수 있습니다.</li>
                          <li><strong>신선도와 성능 조정</strong>: 정적 콘텐츠는 길게(180초), 다이나믹 데이터는 짧게(30초) 유지하도록 값을 다르게 설정할 수 있습니다.</li>
                          <li><strong>모바일 브라우저 배터리 절약</strong>: 네트워크 칩셋 활성화 빈도를 줄여 모바일 기기의 전력 소모와 데이터 비용을 절감합니다.</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li>쇼핑몰 탭 내비게이션(홈, 랭킹, 기획전, 마이페이지) 간의 반복 탐색</li>
                          <li>실시간 재고 조회가 중요한 커머스 화면의 Router Cache 수명 단축 튜닝</li>
                          <li>콘텐츠 변경이 적은 기업 홍보관 및 문서 사이트의 Router Cache 수명 연장</li>
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                          <li><strong>0초 설정 시의 영향</strong>: <code>dynamic: 0</code>으로 설정하면 모든 페이지 이동마다 서버로 요청이 발송되므로 서버 트래픽이 증가함을 인지해야 합니다.</li>
                          <li><strong>Server Actions 후 자동 무효화</strong>: Server Action 실행 시에는 staleTimes 설정과 무관하게 관련 Router Cache가 자동으로 비워질 수 있으므로, 변경 후 화면을 확인해야 합니다.</li>
                        </ul>
                      </div>
                    </div>
                  </DemoDeepDiveCard>
    </div>
  )
}
