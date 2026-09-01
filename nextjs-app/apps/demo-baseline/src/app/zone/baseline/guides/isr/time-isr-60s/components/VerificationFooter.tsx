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

  const defaultExpected = "• 60초 주기 상품 상세 증분 정적 재생성 (ISR)의 동작과 기대 결과를 확인합니다."
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
        title="60초 주기 상품 상세 증분 정적 재생성 (ISR) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="60초 주기 상품 상세 증분 정적 재생성 (ISR)">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>증분 정적 재생성(ISR: Incremental Static Regeneration)은 <code>export const revalidate = 60</code> 설정을 통해 정적으로 사전 빌드된 페이지를 배포한 후, 설정된 주기(60초)가 지난 시점의 첫 요청에 대해 백그라운드에서 페이지를 비동기 재생성하여 캐시를 자동 최신화하는 표준 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 60초 캐시 주기가 부여된 상품 상세 페이지에서 60초 이내에는 빌드 타임스탬프가 고정된 초고속 정적 응답을 반환하고, 60초 경과 후 접근 시 Stale-While-Revalidate 수명 주기에 따라 백그라운드 재생성이 트리거되어 신규 타임스탬프로 교체되는 동작을 시뮬레이션합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>전체 사이트 재빌드 없는 무중단 갱신</strong>: 수백만 개의 페이지가 존재하는 대형 서비스에서도 전체 사이트를 다시 빌드하지 않고 변경된 페이지만 백그라운드 재생성합니다.</li>
                    <li><strong>일관된 초저지연 응답 속도</strong>: 사용자는 항상 캐시된 정적 HTML을 즉시 수신하므로 백엔드 DB 지연에 전혀 영향을 받지 않습니다.</li>
                    <li><strong>안전한 백그라운드 장애 격리</strong>: 백그라운드 재생성 중 백엔드 DB 장애가 발생해도 기존 캐시된 페이지가 지속 서빙되어 사용자 서비스 장애를 방지합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>수만 개의 품목이 존재하는 쇼핑몰 상품 상세 페이지 카탈로그</li>
                    <li>주기적인 주가/환율/암호화폐 일간 리포트 페이지</li>
                    <li>사용자 방문 수가 많은 인기 언론사 기사 및 블로그 아티클</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>첫 번째 방문자의 Stale 데이터 수신</strong>: 60초가 지난 후 최초로 방문한 사용자는 여전히 이전(Stale) 캐시를 보게 되며, 백그라운드 재생성이 완료된 후 그 다음 방문자부터 최신 페이지를 보게 됩니다.</li>
                    <li><strong>Server Action 연동 시 revalidatePath 병행</strong>: 관리자의 긴급 가격 수정처럼 즉각적인 반영이 필요할 때는 60초 주기를 기다리지 않고 <code>revalidatePath()</code>를 함께 호출해야 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
