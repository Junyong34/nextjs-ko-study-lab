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

  const defaultExpected = '• revalidateTag()가 태그를 stale 상태로 표시하고 다음 요청에서 캐시를 갱신하는지 확인합니다.'
  const defaultActual = '• 액션 응답으로 갱신된 재고 목록을 표시합니다.'

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
        title="revalidateTag() 기본 무효화와 SWR 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || '액션 응답과 캐시 상태 변화를 나누어 표시합니다.'}
      />
                        <DemoDeepDiveCard title="revalidateTag()의 태그 무효화">
              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
                  <p><code>revalidateTag(tag)</code>는 지정한 태그가 붙은 캐시를 stale 상태로 표시하는 API입니다. 이후 요청은 기존 값을 먼저 사용할 수 있고, 캐시 설정에 따라 백그라운드에서 새 값을 준비합니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
                  <p>실습화면은 두 패널로 나뉩니다. ①은 <code>page.tsx</code>가 <code>'use cache'</code> 함수 <code>getInventoryCache()</code>로 읽은 <strong>캐시된 조회 결과</strong>이고, ②는 버튼을 눌러 실행한 Server Action의 <strong>즉시 응답</strong>입니다. 버튼을 누르면 재고가 실제로 변경되고 <code>revalidateTag('basic-tag-purge:inventory', 'max')</code>가 호출되지만, ①은 새로고침(<code>router.refresh()</code>) 한 번만으로 바뀌지 않을 수 있습니다 — <code>'max'</code> 프로필은 stale-while-revalidate이라 "다음 방문"에 새 값을 반영하기 때문입니다. 계속 새로고침하거나 버튼을 한 번 더 누르면 ①도 결국 ②와 같은 값으로 따라잡습니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                    <li><strong>태그 단위 무효화</strong>: URL 경로를 몰라도 태그를 기준으로 관련 캐시를 선택해 무효화할 수 있습니다.</li>
                    <li><strong>SWR 방식의 갱신</strong>: 기존 값을 먼저 보여주고 백그라운드에서 새 값을 준비할 수 있습니다.</li>
                    <li><strong>외부 시스템 연동</strong>: ERP나 CMS의 변경 이벤트를 받은 뒤 해당 태그의 캐시를 무효화할 수 있습니다.</li>
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
                    <li><strong>화면 갱신과 캐시 갱신 구분</strong>: ②(액션 응답)는 항상 즉시 최신이지만, ①(캐시된 조회)은 <code>revalidateTag(tag, 'max')</code> 호출만으로 즉시 바뀌지 않을 수 있습니다. 실행 즉시 반영이 꼭 필요하면 Server Action 안에서 <code>updateTag()</code>를 쓰는 방법도 있습니다.</li>
                    <li><strong>데모 접두사</strong>: 태그 이름을 <code>basic-tag-purge:inventory</code>처럼 데모 슬러그로 접두해, 캐시 태그가 앱 전역에서 공유되는 다른 데모에 영향을 주지 않게 합니다.</li>
                  </ul>
                </div>
              </div>
            </DemoDeepDiveCard>
    </div>
  )
}
