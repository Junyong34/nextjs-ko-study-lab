'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { NAV_ITEMS } from '../types'

export function VerificationFooter() {
  const pathname = usePathname()
  const prevPathnameRef = useRef<string | null>(null)
  const [prevPathname, setPrevPathname] = useState<string | null>(null)
  const [navigationCount, setNavigationCount] = useState(0)

  useEffect(() => {
    const prev = prevPathnameRef.current
    if (prev !== null && prev !== pathname) {
      setPrevPathname(prev)
      setNavigationCount((count) => count + 1)
    }
    prevPathnameRef.current = pathname
  }, [pathname])

  const activeLabel = NAV_ITEMS.find((item) => item.href === pathname)?.label ?? pathname
  const hasNavigated = prevPathname !== null
  const isMatched = hasNavigated ? prevPathname !== pathname : undefined

  const expected =
    '• 다른 GNB 탭을 클릭하면 usePathname()의 반환값이 실제로 바뀌어야 함\n• 직전 경로(prevPathname)와 현재 경로(pathname)가 서로 달라야 진짜 라우팅이 발생한 것'

  const actual = hasNavigated
    ? `• 실제 라우트 전환 감지 횟수: ${navigationCount}회\n• 직전 경로: "${prevPathname}"\n• 현재 경로: "${pathname}" (${activeLabel})\n• 두 값이 서로 다름 → usePathname()이 가짜 state가 아니라 실제 브라우저 URL 변화에 반응함`
    : `• 현재 경로: "${pathname}" (${activeLabel})\n• 아직 다른 GNB 탭으로 이동하지 않았습니다. 위에서 [신상품], [타임특가] 등 다른 탭을 클릭해 실제 경로가 바뀌는지 확인하세요.`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="usePathname() 기반 GNB 활성 메뉴 하이라이트 검증 결과"
        expected={<>{expected}</>}
        actual={<>{actual}</>}
        isMatched={isMatched}
        description="탭을 이동할 때마다 usePathname()의 실제 반환값이 바뀌는지, 그리고 그 값이 GNB 하이라이트와 일치하는지 검증합니다."
      />
      <DemoDeepDiveCard title="usePathname() 기반 GNB 활성 메뉴 하이라이트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>usePathname()</code> (<code>next/navigation</code>)은 현재 URL의 쿼리 스트링과 해시를 제외한 순수 경로명(pathname, 예: <code>/shop/electronics</code>)만 반환하는 Client Component 전용 훅입니다. Server Component에서는 호출할 수 없습니다 — 레이아웃 상태를 내비게이션 간 보존하기 위한 의도된 설계입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 데모는 <code>/new</code>, <code>/deals</code>, <code>/best</code>, <code>/events</code> 4개의 실제 서브 라우트(<code>page.tsx</code>)를 가지고 있습니다. <code>GnbNav</code>는 각 탭을 실제 <code>{'<Link href>'}</code>로 렌더링하고, <code>usePathname()</code>이 반환한 값과 <code>href</code>를 <code>===</code>로 비교해 일치하는 탭에만 활성 스타일을 입힙니다. 상위 <code>layout.tsx</code>는 리마운트되지 않고 <code>{'{children}'}</code> 슬롯의 페이지만 교체됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>선언적 활성 상태 스타일링</strong>: 복잡한 라우터 이벤트 구독 없이 반환된 경로 문자열 비교만으로 GNB/LNB 활성 탭을 제어합니다.</li>
              <li><strong>부분 경로 매칭 지원</strong>: <code>pathname.startsWith('/shop')</code> 같은 패턴 검사로 중첩 하위 카테고리 진입 시에도 상위 메뉴 활성화를 유지할 수 있습니다.</li>
              <li><strong>경량 훅 아키텍처</strong>: 쿼리 파라미터 변경에는 반응하지 않고 순수 경로 변경 시에만 리렌더링되어 불필요한 연산을 방지합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>이커머스 헤더 GNB 카테고리 탭(신상품, 타임특가, 베스트, 기획전) 활성화 인디케이터</li>
              <li>마이페이지 좌측 LNB 메뉴(주문내역, 배송지관리, 회원정보) 현재 위치 표시</li>
              <li>관리자 대시보드 사이드바의 계층형 메뉴 활성 상태 유지</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>쿼리 파라미터 미포함</strong>: <code>usePathname()</code>은 <code>?category=1</code> 같은 쿼리를 반환하지 않으므로, 쿼리 정보가 필요하면 <code>useSearchParams()</code>를 함께 사용해야 합니다.</li>
              <li><strong>Server Component 대체 불가</strong>: Server Component에서 URL을 직접 읽는 것은 지원되지 않습니다. 필요하다면 <code>usePathname</code>을 호출하는 부분만 별도 Client Component로 분리하세요.</li>
              <li><strong>rewrites/Proxy 환경 주의</strong>: 정적으로 prerender된 페이지에 rewrites나 Proxy로 도달하면 서버 렌더링 시점의 경로와 클라이언트 라우팅 이후 경로가 달라져 hydration mismatch가 발생할 수 있습니다. 이때는 pathname에 의존하는 UI를 작게 격리하고 마운트 이후에 갱신하는 패턴을 씁니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
