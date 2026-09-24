import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h5 = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="page.tsx가 ○(Static)인지 ƒ(Dynamic)인지 정해지는 방식">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h5}>1. 핵심: 기본은 사전 렌더링, 런타임 API를 쓰면 요청 시 렌더링</h5>
          <p>
            Cache Components를 켜지 않은 앱(이 데모 zone)에서 page는 기본적으로 <code>next build</code> 때 한 번
            실행되어 HTML과 RSC Payload로 저장됩니다(○ Static). page 본문(또는 같은 라우트의 layout)이{' '}
            <code>cookies()</code>, <code>headers()</code>, <code>searchParams</code> 같은 요청 시점 API를 쓰거나{' '}
            <code>connection()</code>으로 &quot;실제 요청까지 기다리라&quot;고 선언하면, 그 라우트는 빌드 때 값을 알 수
            없으므로 요청마다 서버에서 렌더링됩니다(ƒ Dynamic).
          </p>
        </div>
        <div>
          <h5 className={h5}>2. 이 데모의 대조 구조</h5>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">
{`static-and-dynamic/
├─ layout.tsx               # 가이드·실습·검증 틀 (런타임 API 없음)
├─ static/page.tsx          # <RenderStamp/>만          → ○
├─ headers/page.tsx         # await headers()           → ƒ
├─ search-params/page.tsx   # await searchParams        → ƒ
└─ connection/page.tsx      # await connection()        → ƒ`}
          </pre>
          <p className="mt-1.5">
            네 page 모두 같은 <code>RenderStamp</code>(서버 실행 시각 + <code>crypto.randomUUID()</code>)를 그립니다.{' '}
            <code>new Date()</code>나 난수만으로는 동적이 되지 않는다는 점에 주의하세요 — static page에서는 이 값이 빌드 시점에
            고정되어, 몇 번을 요청해도 같은 렌더 ID가 돌아옵니다.
          </p>
        </div>
        <div>
          <h5 className={h5}>3. 실측 근거 읽는 법</h5>
          <ul className={list}>
            <li>
              <strong>렌더 ID 개수</strong>: 같은 URL을 N번 받아 ID가 1개면 사전 렌더링 결과를 재사용한 것, N개면 요청마다 page
              함수가 실행된 것입니다.
            </li>
            <li>
              <strong>x-nextjs-cache</strong>: 캐시된 렌더 결과를 제공했을 때 붙습니다(HIT/STALE/MISS/REVALIDATED). 동적
              page 응답에는 없습니다.
            </li>
            <li>
              <strong>cache-control</strong>: 동적 page는 <code>private, no-cache, no-store</code> 계열로 CDN 캐시를 막고,
              정적 page는 <code>s-maxage</code> 계열로 공유 캐시를 허용합니다.
            </li>
            <li>
              <strong>build 출력 기호</strong>: <code>next build</code> 라우트 표에서 static은 ○, 나머지 셋은 ƒ로 찍힙니다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>4. 주의사항</h5>
          <ul className={list}>
            <li>
              <strong>next dev에서는 차이가 보이지 않음</strong>: 개발 서버는 정적 page도 요청마다 렌더링합니다. 이 데모를 dev로
              실행하면 네 page 모두 렌더 ID가 매번 바뀌는 것이 정상이며, 판정 기준도 실행 모드에 맞춰 바뀝니다.
            </li>
            <li>
              <strong>한 곳만 써도 라우트 전체가 ƒ</strong>: 런타임 API는 page 본문뿐 아니라 그 page가 렌더하는 Server Component나
              상위 layout에서 호출돼도 라우트 전체를 요청 시 렌더링으로 바꿉니다. 정적으로 두고 싶은 라우트에서는 호출 위치를 점검하세요.
            </li>
            <li>
              <strong>Cache Components를 켜면 모델이 달라짐</strong>: <code>cacheComponents</code> 앱에서는 런타임 API를 Suspense
              안으로 격리해 정적 셸 + 스트리밍(◐ Partial Prerender)으로 나눕니다. 이 데모는 그 설정이 없는 zone 기준입니다.
            </li>
            <li>
              <strong>라우트 세그먼트 설정과의 관계</strong>: <code>export const dynamic</code> 등으로 강제할 수도 있지만, 이 데모는
              설정 없이 &quot;page 본문이 무엇을 호출하는가&quot;만으로 렌더 방식이 결정되는 것을 보여줍니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
