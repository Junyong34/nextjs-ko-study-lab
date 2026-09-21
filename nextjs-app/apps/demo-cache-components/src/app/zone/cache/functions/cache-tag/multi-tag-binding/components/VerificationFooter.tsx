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

  const defaultExpected = "• cacheTag 다중 태그 바인딩 및 연관 캐시 구성의 동작과 기대 결과를 확인합니다."
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
        title="cacheTag 다중 태그 바인딩 및 연관 캐시 구성 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="하나의 캐시 항목에 여러 태그 바인딩하기">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>cacheTag()</code>는 여러 문자열을 한 번에 받아 <strong>하나의 캐시 항목</strong>에 여러 태그를 동시에 등록할 수 있다(
              <code>cacheTag('multi-tag-binding:product-891', 'multi-tag-binding:category-electronics', 'multi-tag-binding:brand-logitech')</code>
              ). 태그를 여러 번 적용해도 추가 효과는 없다(idempotent).
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모의 상품 상세 캐시 하나에 상품·카테고리·브랜드 3개 태그가 동시에 묶여 있다. 위 실습화면에서 세 버튼 중 어느 것을 눌러도(<code>revalidateTag('multi-tag-binding:product-891', 'max')</code> /
              <code>...category-electronics...</code> / <code>...brand-logitech...</code>) 같은 캐시 항목이 무효화되어 새로고침 후 <code>cacheId</code>가 바뀐다 — 태그 3개가 서로 다른 캐시가 아니라 같은 캐시 항목을 가리키는 별도의 "열쇠"라는 것을 보여준다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>이벤트 발생 지점 다양화 대응</strong>: 상품 정보 변경, 카테고리 개편, 브랜드 공지 변경 등 서로 다른 이벤트가 각자의 태그로 같은 상품 상세 캐시를 무효화할 수 있다.</li>
              <li><strong>일괄 무효화도 가능</strong>: 카테고리 태그 하나만 무효화해도 그 카테고리에 속한 모든 상품 캐시가 함께 갱신된다(이 데모는 상품 1개만 다루지만 실제로는 여러 상품이 같은 카테고리 태그를 공유한다).</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세 화면(상품 자체 + 소속 카테고리 + 브랜드 정보를 한 화면에 표시)</li>
              <li>게시글 화면(게시글 자체 + 작성자 + 소속 게시판 태그를 동시에 바인딩)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>대소문자 구분</strong>: 캐시 태그 문자열은 대소문자를 엄격히 구분한다.</li>
              <li><strong>데모 접두사 필수</strong>: 캐시 태그는 앱 전역에서 공유되므로 이 저장소는 <code>데모슬러그:태그명</code> 접두사 규칙(예: <code>multi-tag-binding:...</code>)으로 다른 데모의 캐시를 실수로 지우지 않게 한다.</li>
              <li><strong>revalidateTag('max')의 지연 반영</strong>: <code>profile: 'max'</code>는 태그를 stale로 표시할 뿐, 실제 갱신은 다음 방문(새로고침) 시 일어난다. 클릭 직후 한 번에 안 바뀌면 한 번 더 새로고침해서 확인한다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
