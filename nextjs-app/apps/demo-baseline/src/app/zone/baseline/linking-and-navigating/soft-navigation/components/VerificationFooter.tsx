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

  const defaultExpected = "• Link vs a 소프트 네비게이션 및 스크롤 제어 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="Link vs a 소프트 네비게이션 및 스크롤 제어 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="Link vs a 소프트 네비게이션 및 스크롤 제어">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>next/link</code> 컴포넌트는 브라우저의 전체 페이지 새로고침(Hard Reload)을 발생시키는 표준 <code>{'<'}a{'>'}</code> 태그와 달리, 클라이언트 사이드 자바스크립트를 통해 변경된 RSC 세그먼트 페이로드만 수신하여 DOM을 교체하는 소프트 네비게이션(Soft Navigation)과 <code>scroll</code> 복원 제어를 제공하는 표준 API입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 표준 <code>{'<'}Link{'>'}</code>를 통한 이동 시 상단 오디오 플레이어와 전역 카운터 상태가 끊김 없이 연속 재생되는 소프트 네비게이션을 확인하고, <code>{'<'}a{'>'}</code> 태그 이동 시 발생하는 화이트아웃 플래시와 상태 초기화 현상을 비교 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>애플리케이션 상태 연속성 보존</strong>: 페이지 전환 중에도 전역 재생 중인 미디어, 장바구니 모달, 입력창 포커스가 유지됩니다.</li>
                    <li><strong>네트워크 페이로드 극소화</strong>: 매번 HTML/CSS/JS 번들을 재다운로드하지 않고 변경된 데이터(RSC JSON)만 증분 수신합니다.</li>
                    <li><strong>부드러운 SPA 체감 UX</strong>: 브라우저 깜빡임(White-out)이 완전히 사라지고 네이티브 앱과 같은 즉각적인 반응성을 제공합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 상품 상세 페이지 간 이동 중에도 하단 플로팅 미니 플레이어 음악/라이브 방송 연속 재생</li>
                    <li>탭 메뉴 전환 시 사용자가 작성 중이던 1:1 고객 문의 모달 유지</li>
                    <li>카테고리 필터 변경 시 상단으로 스크롤 점프를 방지하는 <code>scroll={'{'}false{'}'}</code> 네비게이션</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>외부 링크 처리</strong>: 외부 사이트(e.g. <code>https://example.com</code>)로 이동할 때는 <code>{'<'}Link{'>'}</code> 대신 표준 <code>{'<'}a{'>'}</code> 태그나 <code>window.location.href</code>를 사용하는 것이 올바른 웹 표준입니다.</li>
                    <li><strong>scroll={'{'}false{'}'} 옵션</strong>: 탭 전환이나 쿼리스트링 변경 시 페이지 최상단으로 강제 스크롤되는 것을 방지하려면 <code>{'<'}Link href="..." scroll={'{'}false{'}'}{'>'}</code>를 설정합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
