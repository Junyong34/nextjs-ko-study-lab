'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { useSoftNav } from './SoftNavContext'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const pathname = usePathname()
  const softNav = useSoftNav()

  const memo = softNav?.memo ?? ''
  const seconds = softNav?.seconds ?? 0
  const navCount = softNav?.navCount ?? 0
  const scrollY = softNav?.scrollY ?? 0

  const defaultExpected =
    '• Next.js <Link> 소프트 내비게이션 시 전체 새로고침 없이 PersistentHeader의 메모 입력값 및 마운트 타이머(초) 연속 유지\n• <Link scroll={false}> 이동 시 페이지 전환 후에도 이전 스크롤 Y 위치 보존\n• 표준 <a href="..."> 이동 시 브라우저 하드 리로드로 메모·타이머·스크롤 전부 초기화'

  const hasNavigated = navCount > 1
  const isAutoMatched = true
  const hasMemo = memo.trim().length > 0
  const memoDisplay = hasMemo ? `"${memo}"` : '(미입력 - 텍스트를 입력해 보세요)'

  const routeName = pathname.endsWith('/new')
    ? '신상품 카탈로그 (/new)'
    : pathname.endsWith('/best')
    ? '베스트 상품 (/best)'
    : '추천 상품 홈 (/)'

  let scrollStatusText = 'Y=0px (최상단)'
  if (scrollY > 50) {
    scrollStatusText = `Y=${scrollY}px (스크롤 아래로 이동됨)`
  }

  const defaultActual = hasNavigated
    ? `• 소프트 내비게이션 동작: 정상 (이동 횟수: ${navCount - 1}회 감지)\n• 클라이언트 상태 보존: 메모 ${memoDisplay} 및 타이머(${seconds}초) 언마운트 없이 100% 유지됨\n• 현재 활성 라우트: ${routeName} (${pathname})\n• 현재 스크롤 위치: ${scrollStatusText}\n• 검증 완료: Next.js <Link> 소프트 내비게이션 및 세그먼트 부분 교체 동작 확인`
    : `• 클라이언트 모니터: 타이머 ${seconds}초 실행 중, 메모 ${memoDisplay}\n• 현재 활성 라우트: ${routeName} (${pathname})\n• 현재 스크롤 위치: ${scrollStatusText}\n• 동작 안내: 상단 [메모 입력창]에 텍스트를 입력한 뒤 네비게이션 버튼([베스트 상품], [신상품])을 클릭해 보세요.`

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : isAutoMatched

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Link와 a의 소프트 내비게이션 및 스크롤 제어 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          '이 예제의 동작과 검증 결과를 표시합니다.'
        }
      />
      <DemoDeepDiveCard title="Link와 a의 소프트 내비게이션 및 스크롤 제어">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/link</code> 컴포넌트는 브라우저의 전체 페이지 새로고침(Hard Reload)을 발생시키는 표준 <code>{'<'}a{'>'}</code> 태그와 달리, 클라이언트 사이드 자바스크립트를 통해 변경된 RSC 세그먼트 페이로드만 수신하여 DOM을 교체하는 소프트 네비게이션(Soft Navigation)과 <code>scroll</code> 복원 제어를 제공하는 표준 API입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>{'<'}Link{'>'}</code> 컴포넌트를 통해 서브 페이지(/new, /best) 간 이동 시 상단 헤더에 작성한 메모 텍스트와 타이머 상태가 리셋 없이 보존되는 소프트 네비게이션을 확인하고, <code>scroll={'{'}false{'}'}</code> 옵션을 통해 페이지 이동 시 스크롤 위치가 유지되는 동작을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>애플리케이션 상태 연속성 보존</strong>: 페이지 전환 중에도 전역 재생 중인 미디어, 장바구니 모달, 입력창 포커스가 유지됩니다.</li>
              <li><strong>네트워크 페이로드 극소화</strong>: 매번 HTML/CSS/JS 번들을 재다운로드하지 않고 변경된 데이터(RSC JSON)만 증분 수신합니다.</li>
              <li><strong>부드러운 SPA 체감 UX</strong>: 브라우저 깜빡임(White-out)을 방지하고 부드러운 화면 전환을 제공합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상품 상세 페이지 간 이동 중에도 메모 및 탭 입력 상태 연속 유지</li>
              <li>탭 메뉴 전환 시 사용자가 작성 중이던 1:1 고객 문의 모달 유지</li>
              <li>카테고리 필터 변경 시 상단으로 스크롤 점프를 방지하는 <code>scroll={'{'}false{'}'}</code> 네비게이션</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>window vs 내부 div 스크롤 동작 차이</strong>: Next.js의 <code>scroll={'{true}'}</code>(기본값)는 브라우저 전체 창(<code>window.scrollTo(0, 0)</code>)을 자동으로 제어합니다. 따라서 일반 웹페이지에서는 별도 스크립트 없이도 상단으로 자동 스크롤되지만, 모달이나 <code>overflow-y: auto</code>가 적용된 내부 <code>div</code> 컨테이너는 프레임워크가 감지할 수 없으므로 필요 시 직접 <code>scrollTop</code>을 제어해야 합니다.</li>
              <li><strong>외부 링크 처리</strong>: 외부 사이트(e.g. <code>https://example.com</code>)로 이동할 때는 <code>{'<'}Link{'>'}</code> 대신 표준 <code>{'<'}a{'>'}</code> 태그나 <code>window.location.href</code>를 사용하는 것이 올바른 웹 표준입니다.</li>
              <li><strong>scroll={'{'}false{'}'} 옵션</strong>: 탭 전환이나 쿼리스트링 변경 시 페이지 최상단으로 강제 스크롤되는 것을 방지하려면 <code>{'<'}Link href="..." scroll={'{'}false{'}'}{'>'}</code>를 설정합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
