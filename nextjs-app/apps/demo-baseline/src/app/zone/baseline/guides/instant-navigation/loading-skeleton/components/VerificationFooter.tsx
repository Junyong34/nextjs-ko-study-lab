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

  const defaultExpected = "• Instant Navigation loading.tsx 스켈레톤 전환의 동작과 기대 결과를 확인합니다."
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
        title="Instant Navigation loading.tsx 스켈레톤 전환 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="Instant Navigation loading.tsx 스켈레톤 전환">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>loading.tsx</code>는 App Router에서 라우트 세그먼트의 <code>page.tsx</code>를 자동으로 <code>{'<'}Suspense{'>'}</code> 바운더리로 감싸고, 서버 데이터 페칭이 진행되는 동안 브라우저에 즉시 스켈레톤(Skeleton) 로딩 UI를 스트리밍하여 0ms 반응성을 보장하는 표준 인스턴트 네비게이션 스펙입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 2초 지연되는 백엔드 상품 목록 페이지로 이동할 때 브라우저 멈춤 없이 즉각 <code>loading.tsx</code>의 상품 카드 스켈레톤 UI가 렌더링되고, 데이터 수신 완료 즉시 실제 상품 그리드로 부드럽게 전환되는 과정을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>체감 지연 시간 제로화</strong>: 링크 클릭 즉시 시각적 피드백(스켈레톤)이 나타나 사용자가 앱이 멈췄다고 느끼는 이탈 요인을 차단합니다.</li>
                    <li><strong>점진적 HTML 스트리밍</strong>: 전체 페이지가 완료되길 기다리지 않고 공통 레이아웃 셸과 스켈레톤을 브라우저에 첫 패킷으로 즉시 전송합니다.</li>
                    <li><strong>선언적 로딩 상태 격리</strong>: 페이지 내부에서 복잡한 <code>isLoading</code> 불리언 분기 없이 파일 단위로 깔끔하게 로딩 뷰를 분리합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>대규모 상품 카탈로그 및 카테고리 기획전 진입 시 스켈레톤 그리드 표시</li>
                    <li>복잡한 매출 통계 그래프를 조회하는 관리자 대시보드 로딩 뷰어</li>
                    <li>주문 결제 내역 조회 및 상세 영수증 로딩 화면</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>동일 레벨 layout.tsx 유지</strong>: <code>loading.tsx</code>는 <code>layout.tsx</code>의 자식으로 렌더링되므로, 상단 GNB나 사이드바는 스켈레톤으로 깜빡이지 않고 그대로 유지됩니다.</li>
                    <li><strong>스켈레톤 레이아웃 일치화</strong>: 스켈레톤 카드의 크기와 여백이 실제 렌더링될 상품 카드와 정확히 일치해야 데이터 로드 시 레이아웃 이동(CLS)을 방지할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
