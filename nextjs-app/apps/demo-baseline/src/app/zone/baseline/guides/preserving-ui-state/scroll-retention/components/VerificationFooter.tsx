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

  const defaultExpected = "• searchParams 필터 스크롤 위치 보존의 동작과 기대 결과를 확인합니다."
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
        title="searchParams 필터 스크롤 위치 보존 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="searchParams 필터 스크롤 위치 보존">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js에서 URL 쿼리 파라미터(<code>searchParams</code>)를 업데이트할 때, <code>router.push(newUrl, {'{'} scroll: false {'}'})</code> 옵션을 명시하여 페이지 최상단으로 강제 스크롤 점프하는 브라우저 기본 동작을 차단하고 사용자가 현재 탐색 중인 스크롤 위치를 그대로 유지하는 표준 스크롤 제어 패턴입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 상품 목록을 아래로 스크롤한 상태에서 가격 필터(10만원 이하, 20만원 이상)나 정렬 기준(인기순, 최신순)을 변경했을 때, URL <code>?price=...&sort=...</code>가 즉시 갱신되면서도 스크롤이 맨 위로 튀지 않고 현재 위치에 안정적으로 머무르는 것을 확인합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>스크롤 점프 피로도 제거</strong>: 필터를 하나 클릭할 때마다 화면이 최상단으로 튕겨 올라가는 불쾌한 UX를 완전히 방지합니다.</li>
                    <li><strong>URL 기반 필터 상태 공유</strong>: 스크롤을 유지하면서도 URL searchParams가 완벽히 동기화되어 새로고침하거나 링크를 공유해도 동일 필터 상태가 복원됩니다.</li>
                    <li><strong>서버 컴포넌트 필터링 연동</strong>: 클라이언트 스크롤 위치를 유지한 채 서버 컴포넌트가 최신 <code>searchParams</code>에 맞는 정렬 결과를 즉시 재렌더링합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 카테고리 페이지의 다중 체크박스(브랜드, 가격, 색상) 필터 선택기</li>
                    <li>대규모 부동산 매물 목록의 지도 영역과 연동된 리스트 정렬 필터</li>
                    <li>호텔 예약 시스템의 숙박 인원 및 날짜 범위 필터링</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Link 컴포넌트의 scroll={'{'}false{'}'}</strong>: <code>{'<'}Link{'>'}</code> 태그를 사용할 때도 <code>{'<'}Link href="..." scroll={'{'}false{'}'}{'>'}</code> 속성을 부여해야 동일한 스크롤 보존 효과를 얻을 수 있습니다.</li>
                    <li><strong>useTransition과의 결합</strong>: <code>startTransition(() ={'>'} router.push(url, {'{'} scroll: false {'}'}))</code> 형태로 래핑하면 필터 변경 중에도 입력 UI가 버벅이지 않고 부드럽게 갱신됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
