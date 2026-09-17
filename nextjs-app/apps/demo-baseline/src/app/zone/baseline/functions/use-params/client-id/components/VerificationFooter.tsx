'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard, MOCK_PRODUCTS } from '@study/demo-kit'
import { BASE_PATH } from '../types'

export function VerificationFooter() {
  const params = useParams<{ category?: string; id?: string }>()
  const pathname = usePathname()
  const currentKey = params.category && params.id ? `${params.category}/${params.id}` : null

  const isFirstRunRef = useRef(true)
  const prevKeyRef = useRef<string | null>(null)
  const [prevKey, setPrevKey] = useState<string | null>(null)
  const [changeCount, setChangeCount] = useState(0)

  useEffect(() => {
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false
      prevKeyRef.current = currentKey
      return
    }
    if (prevKeyRef.current !== currentKey) {
      setPrevKey(prevKeyRef.current)
      setChangeCount((count) => count + 1)
    }
    prevKeyRef.current = currentKey
  }, [currentKey])

  const isDetailRoute = Boolean(params.category && params.id)
  const segmentsMatchUrl = isDetailRoute && pathname === `${BASE_PATH}/${params.category}/${params.id}`
  const matchedProduct = isDetailRoute
    ? MOCK_PRODUCTS.find((p) => p.category === params.category && p.id === params.id)
    : undefined
  const hasObservedChange = changeCount > 0
  const isMatched = isDetailRoute ? (hasObservedChange ? segmentsMatchUrl : undefined) : undefined

  const expected =
    '• 다른 상품 링크로 이동하면 useParams()의 category/id 반환값이 실제로 바뀌어야 함\n' +
    '• 그 값은 useParams() 대신 usePathname()으로 읽은 현재 URL 세그먼트와 정확히 일치해야 함'

  const actual = !isDetailRoute
    ? `• 현재 경로: "${pathname}" (상품 목록)\n• 아직 상품 상세 경로로 이동하지 않았습니다. 위에서 상품 링크를 클릭해 실제 [category]/[id] 세그먼트로 이동하세요.`
    : !hasObservedChange
    ? `• 현재 경로: "${pathname}"\n• useParams() 값: category="${params.category}", id="${params.id}"\n• 아직 다른 상품으로 전환한 적이 없습니다. 다른 상품 링크를 눌러 값이 바뀌는지 확인하세요.`
    : `• 실제 다이나믹 세그먼트 전환 감지 횟수: ${changeCount}회\n• 직전 파라미터: "${prevKey}"\n• 현재 파라미터: "${currentKey}" (useParams() → category="${params.category}", id="${params.id}")\n• 현재 URL(${pathname})과 useParams() 값이 정확히 일치 → 가짜 state가 아니라 실제 라우팅에 반응함\n• 매칭 상품: ${matchedProduct ? matchedProduct.name : '없음 (존재하지 않는 id로 이동한 케이스)'}`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="useParams() 다이나믹 세그먼트 파라미터 추출 검증 결과"
        expected={<>{expected}</>}
        actual={<>{actual}</>}
        isMatched={isMatched}
        description="상품 링크를 이동할 때마다 useParams()의 실제 반환값이 URL 세그먼트와 함께 바뀌는지 검증합니다."
      />
      <DemoDeepDiveCard title="useParams() Client Component 다이나믹 세그먼트 파라미터 추출">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>useParams()</code> (<code>next/navigation</code>)는 Client Component(
              <code>&apos;use client&apos;</code>) 전용 훅으로, 현재 URL이 채운 다이나믹 라우트 세그먼트(예:{' '}
              <code>[category]</code>, <code>[id]</code>)를 객체로 반환합니다. 파라미터를 받지 않으며, 다이나믹
              세그먼트가 없는 라우트에서는 빈 객체 <code>{'{}'}</code>를 반환합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 데모는 실제 파일 시스템 라우트 <code>client-id/[category]/[id]/page.tsx</code>를 가지고
              있습니다. 그 Server Component는 <code>category</code>/<code>id</code> 값을 props로 내려주지 않고{' '}
              <code>{'<ProductParamsPanel />'}</code>만 렌더링하는데, 이 컴포넌트가 <code>const params = useParams()</code>
              를 직접 호출해 현재 URL의 값을 읽어옵니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>Props Drilling 완전 제거</strong>: 깊은 계층의 하위 Client Component에서도 상위 Server
                Component의 Props 전달 없이 파라미터를 직접 조회합니다.
              </li>
              <li>
                <strong>타입 제네릭 지원</strong>: <code>useParams{'<'}{'{'} id: string {'}'}{'>'}()</code>와 같이
                TypeScript 제네릭을 지정해 반환 객체의 타입을 명시할 수 있습니다.
              </li>
              <li>
                <strong>동적/Catch-all 파라미터 자동 파싱</strong>: <code>[...slug]</code> 형태의 다중 세그먼트도
                문자열 배열(<code>string[]</code>)로 자동 매핑합니다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상품 상세(<code>/products/[id]</code>) 화면 깊은 곳에 위치한 [장바구니 담기] 클라이언트 플로팅 버튼</li>
              <li>주문 내역(<code>/orders/[orderId]</code>) 하위의 실시간 결제 상태 확인 위젯</li>
              <li>블로그/문서(<code>/docs/[...slug]</code>) 목차 네비게이션 트리 하이라이트</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>React 19 use(params)와의 차이</strong>: <code>useParams()</code>는 Context에서 읽는
                클라이언트 전용 훅이며, Server/Client Component가 Props로 받는{' '}
                <code>params: Promise&lt;...&gt;</code>를 언래핑하는 <code>use(params)</code>와는 값을 읽는
                경로가 다릅니다.
              </li>
              <li>
                <strong>널/미스매치 방어</strong>: 위 [electronics/does-not-exist] 링크처럼 URL 세그먼트에 대응하는
                데이터가 없을 수 있습니다. <code>useParams()</code>는 문자열을 있는 그대로 반환할 뿐 값의
                존재 여부는 검증하지 않으므로 별도 방어 로직이 필요합니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
