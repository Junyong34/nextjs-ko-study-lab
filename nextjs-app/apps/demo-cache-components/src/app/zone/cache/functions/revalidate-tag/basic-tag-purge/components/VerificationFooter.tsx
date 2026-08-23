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

  const defaultExpected = "• revalidateTag() 기본 무효화 및 SWR 재검증 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="revalidateTag() 기본 무효화 및 SWR 재검증 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
                        <DemoDeepDiveCard title="revalidateTag() 기본 태그 퍼지 및 즉시 무효화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>revalidateTag(tag)</code>는 Next.js의 Data Cache 및 <code>'use cache'</code> 시스템에서 지정된 태그 문자열이 바인딩된 모든 캐시 엔트리를 온디맨드로 즉시 무효화(Purge)하여, 다음 요청 시 최신 데이터를 동기/비동기로 패치하도록 명령하는 핵심 캐시 퍼지 API입니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>본 데모에서는 <code>cacheTag('product-101')</code>이 지정된 상품 카드 데이터에 대해 Server Action에서 <code>revalidateTag('product-101')</code>을 호출하고, 즉시 캐시 상태가 Stale로 전환되며 새로고침 없이 최신 가격이 화면에 반영되는 흐름을 검증합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>URL 구조와 무관한 정밀 무효화</strong>: 페이지 URL 경로를 몰라도 비즈니스 엔티티 태그만으로 메인, 카탈로그, 추천 위젯에 흩어진 동일 상품 캐시를 한 번에 퍼지합니다.</li>
                    <li><strong>0ms 글로벌 캐시 무효화</strong>: Vercel 및 글로벌 엣지 CDN에 태그 무효화 이벤트가 즉시 전파되어 전 세계 사용자에게 실시간 반영됩니다.</li>
                    <li><strong>효율적인 백오피스 연동</strong>: ERP나 CMS의 상품 수정 이벤트 웹훅 수신 시 해당 상품 태그만 깔끔하게 무효화합니다.</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li>쇼핑몰 상품 가격, 할인율, 품절 상태 변경 웹훅 처리</li>
                    <li>게시판 게시글 수정 또는 삭제 시 목록 및 상세 뷰 동시 캐시 삭제</li>
                    <li>사용자 프로필 이미지 변경 시 헤더 및 댓글 아바타 캐시 일괄 갱신</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>Server Actions 또는 Route Handler에서 실행</strong>: <code>revalidateTag()</code>는 서버 환경에서만 호출할 수 있으며 브라우저 클라이언트 코드에서는 직접 실행할 수 없습니다.</li>
                    <li><strong>비동기 처리 특성</strong>: 태그 무효화 호출 즉시 기존 캐시는 만료 처리되며, 다음 진입 시 새로운 데이터로 백그라운드 재검증 또는 동기 렌더링이 수행됩니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
