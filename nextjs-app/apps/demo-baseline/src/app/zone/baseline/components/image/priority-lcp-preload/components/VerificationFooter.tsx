'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { ActualState, ExpectedState, PreloadVariant } from '../types'

export interface VerificationFooterProps {
  variant: PreloadVariant
  expected: ExpectedState
  actual: ActualState
  isMatched?: boolean
}

function formatExpected(state: ExpectedState) {
  const loading = state.loading ? `"${state.loading}"` : '없음(속성 자체가 사라짐)'
  return `• loading 속성: ${loading}\n• <head> 안 preload 링크: ${state.preloadLink ? '있음' : '없음'}`
}

function formatActual(state: ActualState) {
  const loading = state.loading ? `"${state.loading}"` : '없음(속성 자체가 사라짐)'
  return `• loading 속성: ${loading}\n• <head> 안 preload 링크: ${state.preloadLink ? '있음' : '없음'}\n• (참고) fetchpriority 속성: "${state.fetchPriority ?? 'auto'}"`
}

export function VerificationFooter({ variant, expected, actual, isMatched }: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title={`variant="${variant}" — 실제 <head>/<img> DOM 조회 결과 대조`}
        expected={formatExpected(expected)}
        actual={isMatched === undefined ? '측정 중… (프레임 대기)' : formatActual(actual)}
        isMatched={isMatched}
        description="Expected는 next/image 소스코드(get-img-props.js)가 명시한 이 variant의 기대 동작이고, Actual은 지금 렌더된 실제 <img>/<head>를 document API로 직접 읽은 값입니다."
      />
      <DemoDeepDiveCard title="next/image priority(deprecated) vs preload — LCP 이미지 사전 로드">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. priority는 Next.js 16부터 deprecated</h5>
            <p>
              공식 문서(<code>image.mdx#priority</code>)는 &quot;Starting with Next.js 16, the <code>priority</code> property has been deprecated in favor of the <code>preload</code> property in order to make the behavior clear&quot;라고 명시한다. 이 저장소의 기준 버전(next@16.3.2)에서도 <code>priority</code>는 여전히 동작하지만(내부적으로 <code>preload || priority</code>로 합쳐진다), 새 코드에서는 <code>preload</code>를 써야 한다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. preload=true가 실제로 하는 일 — 그리고 하지 않는 일</h5>
            <p>
              <code>preload</code>(또는 deprecated <code>priority</code>)를 <code>true</code>로 주면 Next.js가 React 19의 <code>ReactDOM.preload()</code>를 호출해 <code>&lt;head&gt;</code>에 <code>&lt;link rel=&quot;preload&quot; as=&quot;image&quot;&gt;</code>를 실제로 삽입하고, <code>&lt;img&gt;</code>의 <code>loading=&quot;lazy&quot;</code> 강제를 해제한다(문자열 <code>&quot;eager&quot;</code>가 새로 박히는 게 아니라 <code>loading</code> 속성 자체가 사라진다 — next/image 소스의 <code>isLazy</code> 분기를 직접 읽어 확인했다). 반대로 <code>fetchPriority</code>는 <code>priority</code>/<code>preload</code>와 무관한 완전히 별개의 prop이라 자동으로 <code>&quot;high&quot;</code>가 되지 않는다 — 필요하면 직접 <code>fetchPriority=&quot;high&quot;</code>를 추가로 지정해야 한다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. preload를 쓰지 말아야 할 때</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>뷰포트에 따라 LCP 후보 이미지가 여러 개로 바뀔 수 있는 경우 — preload가 엉뚱한 이미지를 먼저 받아오게 만든다.</li>
              <li><code>loading</code> 속성을 이미 쓰는 경우 — Next.js는 <code>preload</code>(또는 <code>priority</code>)와 <code>loading=&quot;lazy&quot;</code>를 함께 쓰면 런타임 에러를 던진다.</li>
              <li>공식 문서 원문: &quot;In most cases, you should use <code>loading=&quot;eager&quot;</code> or <code>fetchPriority=&quot;high&quot;</code> instead of <code>preload</code>&quot; — 대부분의 경우 <code>preload</code>보다 이 둘이 더 적절하다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 페이지당 1~2개로 제한</h5>
            <p>
              스크롤 하단(below-the-fold) 이미지에 <code>preload</code>를 남발하면 정작 LCP 요소가 될 히어로 이미지의 대역폭을 나눠 갖게 되어 역효과가 난다. 브라우저가 실제로 어떤 엘리먼트를 LCP로 판정했는지는 <code>PerformanceObserver({'{'}type: &apos;largest-contentful-paint&apos;{'}'})</code>로 확인할 수 있다 — 단, LCP는 페이지 로드당 1회성 지표라 사용자가 클릭 등으로 상호작용하면 브라우저가 더 이상 갱신하지 않는다(웹 표준 동작). 이 데모는 그 값을 대신 흉내 내지 않고, variant가 실제로 만들어내는 <code>&lt;link&gt;</code>/<code>&lt;img&gt;</code> 속성 차이만 있는 그대로 보여준다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
