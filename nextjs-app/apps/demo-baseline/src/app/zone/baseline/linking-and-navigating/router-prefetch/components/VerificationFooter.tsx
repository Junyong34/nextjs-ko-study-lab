'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { usePrefetch } from './PrefetchContext'

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
  const prefetchCtx = usePrefetch()

  const isPrefetched = prefetchCtx?.isPrefetched ?? false
  const prefetchTime = prefetchCtx?.prefetchTime ?? null
  const lastAction = prefetchCtx?.lastAction ?? '대기 중'

  const defaultExpected =
    '• router.prefetch(\'/deals\') 호출 시 대상 라우트의 백그라운드 prefetch 등록\n• router.push(\'/deals\') 실행 시 대상 페이지 전환\n• 개발 모드(dev)에서는 API 호출 등록을, 프로덕션(prod)에서는 RSC Payload 청크 캐시를 확인'

  const isAtDeals = pathname.endsWith('/deals')
  const isAutoMatched = isPrefetched && isAtDeals

  const defaultActual = isAutoMatched
    ? `• prefetch 실행: router.prefetch('/deals') 호출 완료 (${prefetchTime})\n• 현재 위치: /deals (특가 상품)\n• 프로그래밍 내비게이션: router.push('/deals') 전환\n• 환경 상태: Next.js API 바인딩 확인 (실제 정적 청크 캐시는 Production 빌드에서 최적화)\n• useRouter prefetch 및 프로그래밍 내비게이션 검증 완료`
    : `• prefetch 상태: ${isPrefetched ? `호출 완료 (${prefetchTime})` : '미실행 (대기 중)'}\n• 현재 위치: ${pathname.replace('/zone/baseline/linking-and-navigating/router-prefetch', '') || '/ (대시보드)'}\n• 최근 액션: ${lastAction}\n• 상태: 1번 [특가 상품 백그라운드 prefetch]를 클릭한 후 2번 [특가 상품으로 이동]을 클릭하세요.`

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : isAutoMatched
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="useRouter를 이용한 프로그래밍 방식 내비게이션과 prefetch 최적화 검증 결과"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          '이 예제의 동작과 검증 결과를 표시합니다.'
        }
      />
      <DemoDeepDiveCard title="useRouter를 이용한 프로그래밍 방식 내비게이션과 prefetch 최적화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
              <p>
              <code>next/navigation</code>의 <code>useRouter()</code> 훅은 <code>router.push()</code>, <code>router.replace()</code>, <code>router.prefetch()</code> 메서드로 클라이언트 내비게이션을 제어합니다. <code>router.prefetch()</code>는 지정한 경로의 RSC 페이로드를 백그라운드에서 미리 요청합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 예제에서는 [1. 특가 상품 백그라운드 prefetch]를 클릭해 <code>router.prefetch('/zone/baseline/router-prefetch/deals')</code>를 호출합니다. 이어서 [2. 특가 상품으로 이동]을 클릭하면 미리 요청한 RSC 페이로드를 활용해 대상 페이지로 이동합니다. 실제 RSC 페이로드 캐시는 production 빌드에서 확인할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>예측 기반 고속 전환</strong>: 사용자 행동(호버, 결제 단계 진행 등)을 기반으로 다음 페이지 자원을 미리 캐싱하여 체감 로딩 속도를 단축합니다.</li>
              <li><strong>유연한 프로그래밍 라우팅</strong>: 폼 검증 완료 후 조건부 분기 이동, 타이머 종료 후 자동 리다이렉트 등 비동기 로직 결합이 용이합니다.</li>
              <li><strong>네트워크 대역폭 제어</strong>: 링크의 자동 prefetch 외에도 필요한 전환 경로만 선택해 prefetch할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>주문 결제 폼 유효성 검사 성공 직후 완료 페이지(<code>/order/complete</code>)로 <code>router.push()</code></li>
              <li>상품을 장바구니에 담은 뒤 [바로 구매하기]를 클릭하거나 호버할 때 주문서 작성 페이지 prefetch</li>
              <li>로그인 세션 만료 알림 팝업 확인 클릭 시 로그인 페이지로 히스토리 덮어쓰기(<code>router.replace()</code>)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>Production 빌드에서 캐시 확인</strong>: <code>router.prefetch()</code>의 실제 백그라운드 캐시 동작은 개발(dev) 모드보다 <code>next build</code> 후 확인하기 쉽습니다.</li>
              <li><strong>대량의 무분별한 prefetch 지양</strong>: 루프나 거대한 테이블의 모든 행에 대해 무차별적으로 <code>router.prefetch()</code>를 호출하면 모바일 사용자의 데이터 대역폭과 CPU 자원을 낭비할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
