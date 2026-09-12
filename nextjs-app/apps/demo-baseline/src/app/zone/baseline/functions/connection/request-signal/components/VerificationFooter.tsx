'use client'

import React, { useEffect, useState } from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard, DemoResetButton } from '@study/demo-kit'

const DYNAMIC_URL = '/zone/baseline/functions/connection/request-signal/dynamic-branch'
const STATIC_URL = '/zone/baseline/functions/connection/request-signal/static-branch'

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
  dynamicFirst: string | null
  dynamicSecond: string | null
  staticOnce: string | null
  error: string | null
}

const INITIAL_STATE: ProbeState = {
  loading: true,
  dynamicFirst: null,
  dynamicSecond: null,
  staticOnce: null,
  error: null,
}

/**
 * 이 패널은 실습 화면과 별도로 /static-branch, /dynamic-branch 두 실제 라우트에
 * fetch()를 직접 보내 서버가 반환한 렌더 시각을 비교한다 — 실습 화면에서 관찰한 값을
 * 그대로 믿지 않고 독립적으로 재확인한다.
 */
export function VerificationFooter() {
  const [state, setState] = useState<ProbeState>(INITIAL_STATE)

  const runVerification = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const dynamicFirst = await fetchRenderedAt(DYNAMIC_URL)
      const staticOnce = await fetchRenderedAt(STATIC_URL)
      const dynamicSecond = await fetchRenderedAt(DYNAMIC_URL)
      setState({ loading: false, dynamicFirst, dynamicSecond, staticOnce, error: null })
    } catch {
      setState({
        loading: false,
        dynamicFirst: null,
        dynamicSecond: null,
        staticOnce: null,
        error: '두 브랜치 라우트에 실제 요청을 보내지 못했습니다.',
      })
    }
  }

  useEffect(() => {
    runVerification()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { loading, dynamicFirst, dynamicSecond, staticOnce, error } = state
  const isMatched =
    !loading && !error && dynamicFirst !== null && dynamicSecond !== null
      ? dynamicFirst !== dynamicSecond
      : undefined

  const expected = [
    'connection() 브랜치(/dynamic-branch)를 연속으로 두 번 요청하면,',
    '두 렌더 시각(renderedAt)이 서로 달라야 한다 — 코드가 매 요청 새로 실행된다는 증거.',
  ].join('\n')

  const actual = loading
    ? '두 브랜치에 실제 요청을 보내는 중...'
    : error
      ? error
      : [
          `1차 요청 렌더 시각: ${dynamicFirst ?? '(읽기 실패)'}`,
          `2차 요청 렌더 시각: ${dynamicSecond ?? '(읽기 실패)'}`,
          `참고 — 정적 브랜치(/static-branch) 렌더 시각: ${staticOnce ?? '(읽기 실패)'}`,
          'next dev에서는 정적 브랜치도 매 요청 새로 렌더링되어 이 값이 함께 바뀔 수 있다 — 이 차이는 next build 결과로만 확인된다(아래 [개념 정리] 참고).',
        ].join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="connection() 브랜치의 요청별 재실행 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="/static-branch, /dynamic-branch 두 실제 라우트에 직접 fetch() 요청을 보내 서버가 반환한 렌더 시각을 비교합니다."
      />
      <div className="flex justify-end">
        <DemoResetButton label="다시 검증" loadingLabel="요청 중..." onReset={runVerification} />
      </div>
      <DemoDeepDiveCard title="connection() 요청 시점 렌더링 강제">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 동작 원리</h5>
            <p>
              <code>connection()</code> (<code>next/server</code>)은 매개변수 없이 <code>Promise&lt;void&gt;</code>를
              반환하는 비동기 함수다. <code>await connection()</code> 호출 지점에서 정적 prerender가 멈추고, 그
              아래 코드는 실제 클라이언트 요청이 들어온 시점에만 실행된다. <code>cookies()</code>나{' '}
              <code>headers()</code>처럼 요청 시점 API를 직접 읽지 않지만 <code>Math.random()</code>,{' '}
              <code>new Date()</code>, 동기 DB 쿼리처럼 매 요청 달라져야 하는 값을 다룰 때 필요하다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 동작 원리</h5>
            <p>
              <code>/static-branch</code>는 connection()을 호출하지 않고 재고 값과 렌더 시각을 곧바로 계산한다.{' '}
              <code>/dynamic-branch</code>는 정적 App Shell 문구 다음에 <code>await connection()</code>이 선언된{' '}
              <code>&lt;Suspense&gt;</code> 하위 컴포넌트를 배치해, connection() 이후 코드가 실제로 요청 시점에
              실행되는 것을 스트리밍 지연으로 보여준다.
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
              직접 실행해 그대로 캡처한 실제 라우트 표다(2026-09-12 캡처, 조작 없음 — 재현하려면 이 앱 디렉토리에서
              같은 명령을 다시 실행):
            </p>
            <pre className="mt-2 overflow-x-auto rounded bg-zinc-950 p-2.5 font-mono text-[11px] leading-relaxed text-zinc-300">
{`Route (app)                                                          Revalidate  Expire
├ ○ /zone/baseline/functions/connection/request-signal
├ ƒ /zone/baseline/functions/connection/request-signal/dynamic-branch
├ ○ /zone/baseline/functions/connection/request-signal/static-branch

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand`}
            </pre>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항 (Caution &amp; Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>레거시 API 대체</strong>: <code>connection()</code>은 Next.js 15에서 도입되어{' '}
                <code>unstable_noStore()</code>를 공식 대체한다.
              </li>
              <li>
                <strong>이미 Request-time API를 쓴다면 불필요</strong>: <code>cookies()</code>,{' '}
                <code>headers()</code>, <code>searchParams</code>를 이미 읽고 있다면 그 자체로 다이나믹
                렌더링이 강제되므로 <code>connection()</code>을 추가할 필요가 없다.
              </li>
              <li>
                <strong>Cache Components 환경에서는 io() 우선 검토</strong>: 이 zone(<code>demo-baseline</code>)의{' '}
                <code>next.config.ts</code>에는 <code>cacheComponents</code>가 켜져 있지 않다 — 이 조건에서는{' '}
                <code>connection()</code>이 표준 선택지다. <code>cacheComponents</code>가 켜진 환경(
                <code>demo-cache-components</code> zone)이라면 캐시·프리페치까지 지원하는{' '}
                <code>io()</code>를 먼저 검토해야 한다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
