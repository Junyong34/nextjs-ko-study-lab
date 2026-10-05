import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h5 = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="[slug]가 있으면 동적 렌더링일까? — 실측으로 읽는 판정 기준">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h5}>1. 이 zone(Cache Components 꺼짐)에서 실측한 결과</h5>
          <ul className={list}>
            <li>
              <strong>[slug]만 있고 generateStaticParams가 없으면 ƒ(Dynamic)</strong>: 본문에 <code>headers()</code> 같은 런타임 API가
              없어도 빌드 표에 ƒ로 찍히고, 같은 URL을 여러 번 받으면 렌더 ID가 매번 바뀝니다. 빌드 때 어떤 slug 값이 올지 알 수
              없기 때문입니다.
            </li>
            <li>
              <strong>generateStaticParams가 반환한 값은 ●(SSG)</strong>: 빌드 때 만든 HTML을 재사용해 렌더 ID가 1개로 고정됩니다.
            </li>
            <li>
              <strong>목록 밖의 값은 첫 요청에 렌더되고 이후 재사용</strong>: <code>dynamicParams</code>의 기본값(true) 때문입니다.
              첫 요청은 <code>x-nextjs-cache: MISS</code>, 그 뒤는 HIT이고 렌더 ID는 같습니다. 즉 &quot;목록에 없는 값 = 매번 동적&quot;이
              아닙니다.
            </li>
            <li>
              <strong>목록이 있어도 본문에서 headers()를 호출하면 ƒ</strong>: <code>generateStaticParams</code>는 어떤 값을 미리 만들지
              정할 뿐, 요청 시점 API가 있으면 그 라우트는 요청마다 렌더링됩니다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>2. 이 데모의 대조 구조</h5>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">
{`static-or-dynamic/
├─ no-gsp/[slug]/page.tsx       # generateStaticParams 없음        → ƒ
├─ with-gsp/[slug]/page.tsx     # generateStaticParams(alpha,beta) → ● (zeta는 첫 요청 뒤 재사용)
└─ with-headers/[slug]/page.tsx # generateStaticParams + headers() → ƒ`}
          </pre>
        </div>
        <div>
          <h5 className={h5}>3. 주의사항</h5>
          <ul className={list}>
            <li>
              <strong>next dev에서는 차이가 보이지 않음</strong>: 개발 서버는 모든 라우트를 요청마다 렌더링합니다. 판정은
              <code> next build && next start</code>에서만 의미가 있습니다.
            </li>
            <li>
              <strong>Cache Components를 켠 앱은 모델이 다름</strong>: 이 데모는 켜지 않은 zone 기준이며, 켠 앱에서 같은 라우트가
              어떻게 판정되는지는 이 데모에서 실측하지 않았습니다.
            </li>
            <li>
              <strong>generateStaticParams는 최소 1개를 반환</strong>해야 합니다. 빈 배열은 빌드 오류입니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
