'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { CaseExpectation, CaseId, ProbeResult } from '../types'

const LABEL: Record<CaseId, string> = {
  'static-blur': 'A 정적 import + blur',
  'remote-blur': 'B 동적 URL + blur',
  'remote-empty': 'C 동적 URL + empty',
}
const ORDER: CaseId[] = ['static-blur', 'remote-blur', 'remote-empty']

interface Props {
  delay: number
  expectations: Record<CaseId, CaseExpectation>
  results: Record<CaseId, ProbeResult>
  staticMeta: { blurWidth: number | null; blurHeight: number | null; blurDataURLLength: number; manualLength: number }
}

function caseMatched(exp: CaseExpectation, res: ProbeResult): boolean | undefined {
  if (!res.initial || res.bgAfterLoad === null) return undefined
  const bgOk = res.initial.cssLength > 0 === exp.bgInitially
  const hrefOk = exp.expectedHref === null ? res.initial.innerHref === null : res.initial.innerHref === exp.expectedHref
  return bgOk && hrefOk && res.bgAfterLoad === false
}

function Lines({ lines }: { lines: string[] }) {
  return (
    <ul className="space-y-1">
      {lines.map((l) => (
        <li key={l}>• {l}</li>
      ))}
    </ul>
  )
}

export function VerificationFooter({ delay, expectations, results, staticMeta }: Props) {
  const perCase = ORDER.map((id) => caseMatched(expectations[id], results[id]))
  const isMatched = perCase.some((m) => m === undefined) ? undefined : perCase.every(Boolean)

  const expectedLines = ORDER.map((id) => {
    const e = expectations[id]
    return e.bgInitially
      ? `${LABEL[id]}: 로드 전 background-image 있음, 안의 blurDataURL = ${e.source}, 로드 후 제거`
      : `${LABEL[id]}: 로드 전후 모두 background-image 없음(빈 칸)`
  })

  const actualLines = ORDER.map((id, i) => {
    const r = results[id]
    if (!r.initial || r.bgAfterLoad === null) return `${LABEL[id]}: 측정 중…`
    const before = r.initial.cssLength > 0 ? `있음(${r.initial.cssLength}자)` : '없음'
    const href = r.initial.innerHref
      ? `blurDataURL ${r.initial.innerHref === expectations[id].expectedHref ? '일치' : '불일치'}(${r.initial.innerHref.length}자)`
      : 'blurDataURL 없음'
    const after = r.bgAfterLoad
      ? '로드 후에도 남음'
      : r.bgRemovedMs !== null
        ? `로드 후 제거(${r.bgRemovedMs} ms)`
        : '로드 후에도 없음'
    const mark = perCase[i] ? '' : ' [불일치]'
    return `${LABEL[id]}: 로드 전 ${before}, ${href}, onLoad ${r.loadMs} ms, ${after}${mark}`
  })

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title={`placeholder별 실제 <img> style 대조 (서버 지연 ${delay} ms)`}
        expected={<Lines lines={expectedLines} />}
        actual={<Lines lines={actualLines} />}
        isMatched={isMatched}
        description={`Expected는 공식 문서와 next/image 소스(get-img-props.js)의 동작이고, Actual은 렌더된 <img>의 style.backgroundImage·onLoad·MutationObserver 실측값입니다. 정적 import 객체: blurWidth=${staticMeta.blurWidth ?? '없음'}, blurHeight=${staticMeta.blurHeight ?? '없음'}, blurDataURL ${staticMeta.blurDataURLLength}자 / 직접 만든 blurDataURL ${staticMeta.manualLength}자.`}
      />
      <DemoDeepDiveCard title="placeholder='blur'는 어디서 온 blurDataURL을, 언제까지 보여주는가">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 플레이스홀더의 정체는 &lt;img&gt;의 inline background-image</h5>
            <p>
              별도 DOM 요소가 생기지 않는다. <code>placeholder=&quot;blur&quot;</code>면 next/image가 <code>blurDataURL</code>을
              <code> feGaussianBlur</code> 필터가 든 SVG(<code>data:image/svg+xml</code>)로 감싸 <code>style.backgroundImage</code>에 넣는다.
              이미지가 load → <code>decode()</code>까지 끝나면 내부 상태 <code>blurComplete</code>가 true로 바뀌어 이 style이 빠진다.
              사용자의 <code>onLoad</code>는 바로 그 시점에 호출되므로, 위 표의 &quot;onLoad&quot;와 &quot;제거 시점&quot;이 거의 같게 측정된다.
              <code> placeholder=&quot;empty&quot;</code>(기본값)는 background를 아예 만들지 않아 응답이 올 때까지 빈 칸(체크 무늬)이 보인다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. blurDataURL의 출처 — 자동 vs 직접</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>정적 import</strong>(jpg·png·webp·avif, 애니메이션 제외): 번들러가 import 객체에 <code>blurDataURL</code>·<code>blurWidth</code>·<code>blurHeight</code>를
                붙인다. 긴 변을 8px로 줄인 base64 이미지다. 이 앱은 <code>images.unoptimized: true</code>지만, 실측 결과 정적 import의 blurDataURL은
                그대로 자동 생성됐다 — unoptimized는 런타임 <code>/_next/image</code> 최적화만 끄고 빌드 시점 블러 생성과는 별개다.
              </li>
              <li>
                <strong>원격·동적 URL</strong>: 빌드가 파일에 접근할 수 없어 자동 생성이 불가능하다. <code>blurDataURL</code> 없이{' '}
                <code>placeholder=&quot;blur&quot;</code>를 쓰면 &quot;missing the blurDataURL property&quot; 에러가 난다. 이 데모는
                <code> lib/scene.ts</code>가 서버에서 같은 장면을 8x4로 인코딩해 prop으로 넘긴다(plaiceholder 같은 도구의 역할).
              </li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 주의사항</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>blurDataURL은 HTML/RSC 페이로드에 인라인된다. 큰 이미지를 넣으면 문서가 무거워지므로 10px 이하를 권장한다(공식 문서).</li>
              <li>40x40보다 작은 이미지에 placeholder를 주면 개발 모드에서 경고가 나온다 — 효과보다 비용이 크다.</li>
              <li>
                <code>next dev</code>의 webpack 로더는 블러를 <code>/_next/image?w=8</code> URL로 지연 생성하는 분기가 있으나, 이 앱(Turbopack)의 실측 HTML에는
                처음부터 <code>data:image/png;base64</code>가 들어 있었다. 번들러에 따라 달라질 수 있으니 표의 &quot;안에 든 blurDataURL&quot; 값을 직접 확인한다.
              </li>
              <li>LCP·preload 같은 &quot;언제 요청하느냐&quot;는 이 데모의 범위가 아니다 — 형제 실습 priority-lcp-preload를 참고한다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
