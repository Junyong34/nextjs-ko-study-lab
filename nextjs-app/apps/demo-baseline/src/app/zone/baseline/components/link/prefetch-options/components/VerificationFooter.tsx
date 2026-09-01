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

  const defaultExpected = "• <Link prefetch> 옵션 대조 (auto vs full vs false)의 동작과 기대 결과를 확인합니다."
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
        title="<Link prefetch> 옵션 대조 (auto vs full vs false) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="<Link prefetch> 옵션 대조 (auto vs full vs false) & 네트워크 최적화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>{'<'}Link{'>'}</code> 컴포넌트의 <code>prefetch</code> 속성은 사용자가 링크를 클릭하기 전에 대상 페이지의 RSC 페이로드와 데이터를 뷰포트 진입 시 미리 다운로드하는 기능으로, <code>true</code>(전체 사전 로드), <code>false</code>(사전 로드 비활성화), <code>null</code>(기본값 auto: 정적 세그먼트만 사전 로드) 옵션을 제공합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 구매 전환율이 높은 [주문하기] 링크에는 <code>prefetch={'{'}true{'}'}</code>(즉시 전환 0ms), 트래픽이 낮은 [개인정보처리방침]에는 <code>prefetch={'{'}false{'}'}</code>(불필요한 네트워크 절약), 일반 상품 카드에는 기본 <code>auto</code> 모드를 적용하여 네트워크 대역폭과 내비게이션 속도의 균형을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>클릭 즉시 화면 전환 (Instant Navigation)</strong>: 미리 캐시된 RSC 페이로드를 사용하여 네트워크 지연 없이 0ms로 화면이 전환됩니다.</li>
              <li><strong>서버 부하 및 대역폭 제어</strong>: 무한 스크롤이나 수천 개의 링크가 있는 화면에서 불필요한 prefetch 요청을 차단하여 서버 부하를 방지합니다.</li>
              <li><strong>정적/동적 세그먼트 지능형 분리</strong>: <code>auto</code> 모드에서는 정적 레이아웃 셸만 먼저 prefetch하고 동적 데이터는 클릭 시점에 효율적으로 가져옵니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 장바구니/주문서 이동 등 핵심 결제 경로 사전 로드 (<code>prefetch={'{'}true{'}'}</code>)</li>
              <li>수천 개의 푸터 링크 및 모달 닫기 링크의 prefetch 차단 (<code>prefetch={'{'}false{'}'}</code>)</li>
              <li>상품 목록 카탈로그의 뷰포트 기반 기본 스마트 prefetch (<code>auto</code>)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>개발 모드(Development) 동작 차이</strong>: <code>prefetch</code> 기능은 프로덕션 빌드(<code>pnpm build && pnpm start</code>) 환경에서만 실제로 네트워크 탭에 관찰되며 개발 모드(dev)에서는 링크 hover 시에만 일부 동작합니다.</li>
              <li><strong>PPR(Partial Prerendering)과의 시너지</strong>: Next.js 최신 PPR 환경에서 <code>auto</code> prefetch는 정적 셸만 신속히 가져와 메모리 효율을 극대화합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
