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

  const defaultExpected = "• Router Cache와 뒤로 가기 시 복원의 동작과 기대 결과를 확인합니다."
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
        title="Router Cache와 뒤로 가기 시 복원 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
                        <DemoDeepDiveCard title="Router Cache와 뒤로 가기 시 복원">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p>Next.js의 클라이언트 사이드 Router Cache는 브라우저 메모리에 이미 방문했던 라우트 세그먼트의 RSC 페이로드를 저장하여, 사용자가 뒤로가기(Back)나 앞으로가기(Forward) 네비게이션을 수행할 때 서버 재요청 없이 0ms 즉시 화면과 스크롤 상태를 복원하는 표준 캐싱 메커니즘입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 상품 목록에서 상세 페이지로 이동한 후 브라우저 뒤로가기 버튼을 클릭했을 때, 네트워크 탭에 신규 서버 요청이 전혀 발생하지 않고 메모리 캐시로부터 상품 목록 뷰와 이전 스크롤 위치가 즉각 복구되는 흐름을 시각화합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>초고속 뒤로가기 탐색 UX</strong>: 브라우저 히스토리 이동 시 네트워크 대기 시간이 완전히 사라져 네이티브 앱과 동일한 즉각적 반응성을 제공합니다.</li>
                    <li><strong>불필요한 중복 서버 부하 제거</strong>: 동일 세션 내에서 반복 조회되는 이전 페이지에 대한 서버 CPU 및 데이터베이스 조회를 차단합니다.</li>
                    <li><strong>스크롤 위치 및 인터랙션 보존</strong>: 목록 탐색 중 상세로 진입했다가 돌아왔을 때 사용자가 보던 정확한 스크롤 지점을 자동 복원합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 상품 카탈로그 목록 ↔ 상품 상세 페이지 간의 빈번한 왕복 탐색</li>
                    <li>검색 결과 목록에서 개별 게시글 확인 후 다시 검색 목록으로 복귀</li>
                    <li>다단계 회원가입 또는 주문서 작성 마법사에서의 이전 단계 확인</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Router Cache 최신화(router.refresh)</strong>: 서버 데이터가 변경되었는데 클라이언트 Router Cache가 이전 상태를 보여주는 경우 <code>router.refresh()</code>를 호출하여 명시적으로 캐시를 무효화해야 합니다.</li>
                    <li><strong>staleTimes 설정 제어</strong>: <code>next.config.ts</code>의 <code>experimental.staleTimes</code> 설정을 통해 정적/동적 라우트의 클라이언트 Router Cache 유지 기간을 커스터마이징할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
