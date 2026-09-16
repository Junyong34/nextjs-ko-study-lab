'use client'

import React, { useEffect, useState } from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard, DemoResetButton } from '@study/demo-kit'

const NO_STORE_URL = '/zone/baseline/functions/unstable-no-store/dynamic-bailout/no-store-branch'
const STATIC_URL = '/zone/baseline/functions/unstable-no-store/dynamic-bailout/static-branch'

function extractRenderedAt(html: string): string | null {
  const match = html.match(/data-rendered-at="([^"]+)"/)
  return match ? match[1] : null
}

async function fetchRenderedAt(url: string): Promise<string | null> {
  const res = await fetch(url, { cache: 'no-store' })
  const html = await res.text()
  return extractRenderedAt(html)
}

interface ProbeState {
  loading: boolean
  noStoreFirst: string | null
  noStoreSecond: string | null
  staticOnce: string | null
  error: string | null
}

const INITIAL_STATE: ProbeState = {
  loading: true,
  noStoreFirst: null,
  noStoreSecond: null,
  staticOnce: null,
  error: null,
}

/**
 * 이 패널은 실습 화면과 별도로 /static-branch, /no-store-branch 두 실제 라우트에
 * fetch()를 직접 보내 서버가 반환한 렌더 시각을 비교한다 — 실습 화면에서 관찰한 값을
 * 그대로 믿지 않고 독립적으로 재확인한다.
 */
export function VerificationFooter() {
  const [state, setState] = useState<ProbeState>(INITIAL_STATE)

  const runVerification = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const noStoreFirst = await fetchRenderedAt(NO_STORE_URL)
      const staticOnce = await fetchRenderedAt(STATIC_URL)
      const noStoreSecond = await fetchRenderedAt(NO_STORE_URL)
      setState({ loading: false, noStoreFirst, noStoreSecond, staticOnce, error: null })
    } catch {
      setState({
        loading: false,
        noStoreFirst: null,
        noStoreSecond: null,
        staticOnce: null,
        error: '두 브랜치 라우트에 실제 요청을 보내지 못했습니다.',
      })
    }
  }

  useEffect(() => {
    runVerification()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { loading, noStoreFirst, noStoreSecond, staticOnce, error } = state
  const isMatched =
    !loading && !error && noStoreFirst !== null && noStoreSecond !== null
      ? noStoreFirst !== noStoreSecond
      : undefined

  const expected = [
    'unstable_noStore() 브랜치(/no-store-branch)를 연속으로 두 번 요청하면,',
    '두 렌더 시각(renderedAt)이 서로 달라야 한다 — 코드가 매 요청 새로 실행된다는 증거.',
  ].join('\n')

  const actual = loading
    ? '두 브랜치에 실제 요청을 보내는 중...'
    : error
      ? error
      : [
          `1차 요청 렌더 시각: ${noStoreFirst ?? '(읽기 실패)'}`,
          `2차 요청 렌더 시각: ${noStoreSecond ?? '(읽기 실패)'}`,
          `참고 — 정적 브랜치(/static-branch) 렌더 시각: ${staticOnce ?? '(읽기 실패)'}`,
          'next dev에서는 정적 브랜치도 매 요청 새로 렌더링되어 이 값이 함께 바뀔 수 있다 — 이 차이는 next build 결과로만 확인된다(아래 [개념 정리] 참고).',
        ].join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="unstable_noStore() 브랜치의 요청별 재실행 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="/static-branch, /no-store-branch 두 실제 라우트에 직접 fetch() 요청을 보내 서버가 반환한 렌더 시각을 비교합니다."
      />
      <div className="flex justify-end">
        <DemoResetButton label="다시 검증" loadingLabel="요청 중..." onReset={runVerification} />
      </div>
      <DemoDeepDiveCard title="unstable_noStore() 요청 시점 렌더링 강제">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 동작 원리</h5>
            <p>
              <code>unstable_noStore</code> (<code>next/cache</code>)는 매개변수 없이 호출하는 동기 함수로,
              선언적으로 정적 prerender를 옵트아웃하고 해당 컴포넌트가 캐시되지 않도록 지정한다.{' '}
              <code>fetch(url, {'{'} cache: &apos;no-store&apos; {'}'})</code>와 동일한 효과를 내며, DB
              쿼리처럼 <code>fetch</code>를 쓰지 않는 코드에서 페이지 전체를 동적으로 바꾸는{' '}
              <code>export const dynamic = &apos;force-dynamic&apos;</code> 대신 컴포넌트 단위로 정밀하게
              캐시를 해제할 때 쓴다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 동작 원리</h5>
            <p>
              <code>/static-branch</code>는 unstable_noStore()를 호출하지 않고 참여 인원 값과 렌더 시각을
              곧바로 계산한다. <code>/no-store-branch</code>는 컴포넌트 최상단에서 <code>noStore()</code>를
              동기 호출한 뒤 같은 계산을 수행한다 — <code>connection()</code>과 달리 Promise를 반환하지 않아{' '}
              <code>await</code>도 <code>Suspense</code> 스트리밍 경계도 필요 없다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              3. next dev와 next build의 차이 — 실제 빌드 로그
            </h5>
            <p>
              Next.js 공식 문서: &quot;In Development, Pages are always rendered on-demand and are never
              cached.&quot; — 즉 <code>next dev</code>에서는 두 브랜치 모두 새로고침마다 값이 바뀐다. 정적/다이나믹
              분류는 실제 프로덕션 빌드로만 확인할 수 있다. 아래는 이 브랜치에서 <code>npx next build</code>를
              직접 실행해 그대로 캡처한 실제 라우트 표다(2026-09-17 캡처, 조작 없음 — 재현하려면 이 앱 디렉토리에서
              같은 명령을 다시 실행):
            </p>
            <pre className="mt-2 overflow-x-auto rounded bg-zinc-950 p-2.5 font-mono text-[11px] leading-relaxed text-zinc-300">
{`Route (app)                                                             Revalidate  Expire
├ ○ /zone/baseline/functions/unstable-no-store/dynamic-bailout
├ ƒ /zone/baseline/functions/unstable-no-store/dynamic-bailout/no-store-branch
├ ○ /zone/baseline/functions/unstable-no-store/dynamic-bailout/static-branch

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand`}
            </pre>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항 (Caution &amp; Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>Legacy API</strong>: 공식 문서는 <code>unstable_noStore</code>를{' '}
                <code>version: legacy</code>로 표기한다. Next.js 15부터는 같은 목적의 표준 함수인{' '}
                <code>connection()</code>(<code>next/server</code>)을 대신 쓰도록 권장한다. 신규 코드는{' '}
                <code>connection()</code>을 우선 검토하고, <code>unstable_noStore</code>는 하위 호환 유지용
                레거시 코드에서만 남겨 둔다.
              </li>
              <li>
                <strong>unstable_cache 내부에서는 무력화</strong>: <code>unstable_cache</code> 내부에서{' '}
                <code>unstable_noStore()</code>를 호출해도 정적 생성을 옵트아웃하지 않는다 —{' '}
                <code>unstable_cache</code> 자체의 캐시 설정이 우선한다.
              </li>
              <li>
                <strong>Cache Components 환경에서는 별개의 모델</strong>: 이 zone(<code>demo-baseline</code>)의{' '}
                <code>next.config.ts</code>에는 <code>cacheComponents</code>가 켜져 있지 않다 — "기본은
                정적, Request-time API 호출 시점부터 다이나믹"이라는 이 데모의 모델은 그 조건에서만
                성립한다. <code>cacheComponents</code>가 켜진 환경(<code>demo-cache-components</code> zone)은
                반대로 "기본은 다이나믹, <code>&apos;use cache&apos;</code>로 명시해야 캐시"되는 모델이라{' '}
                <code>unstable_noStore</code>/<code>connection()</code> 자체가 무의미해진다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
