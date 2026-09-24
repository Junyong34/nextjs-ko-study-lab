import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const H = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const LIST = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function ConceptDeepDive() {
  return (
    <DemoDeepDiveCard title="구체 경로 vs 다이나믹 패턴 경로 인자">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={H}>1. 핵심 메커니즘 — 암묵적 태그</h5>
          <p>
            <code>/products/1</code>을 렌더하는 동안 만들어진 <code>&apos;use cache&apos;</code> 엔트리는 그 요청의 구체 경로
            (<code>/products/1</code>)와 렌더한 라우트 파일 패턴(<code>/products/[id]/page</code>)을 암묵적 태그로 갖습니다.
            <code>revalidatePath(&apos;/products/1&apos;)</code>는 앞의 태그를, <code>revalidatePath(&apos;/products/[id]&apos;, &apos;page&apos;)</code>는
            뒤의 태그를 만료시키므로 전자는 한 경로, 후자는 그 page 파일로 렌더되는 모든 경로가 다음 요청에서 다시 계산됩니다.
          </p>
        </div>
        <div>
          <h5 className={H}>2. 파일 구조와 실제 인자</h5>
          <pre className="overflow-x-auto rounded bg-zinc-100 p-2 font-mono text-[11px] dark:bg-zinc-900">{`dynamic-route/
├─ page.tsx              허브 (iframe 3개 + 버튼)
├─ actions.ts            revalidatePath 호출 (Server Action)
├─ cachedData.ts         getProductSnapshot — 'use cache'
└─ products/[id]/page.tsx  cacheId + 요청 시각 렌더

revalidatePath('/zone/cache/.../products/1')
revalidatePath('/zone/cache/.../products/[id]', 'page')`}</pre>
          <p className="mt-1">
            셸은 <code>/zone/cache/*</code>를 같은 경로로 이 zone에 rewrite하고 이 앱에는 basePath가 없으므로,
            라우트 파일 구조 기준 경로가 곧 <code>/zone/cache/...</code>입니다. rewrite를 쓴다면 항상 목적지(라우트 파일) 경로를 넘깁니다.
          </p>
        </div>
        <div>
          <h5 className={H}>3. type 인자 규칙</h5>
          <ul className={LIST}>
            <li>구체 경로(<code>/products/1</code>)에는 <code>type</code>을 생략합니다.</li>
            <li>패턴(<code>/products/[id]</code>)에는 <code>type</code>이 필수입니다. 생략하면 Next.js가 서버 콘솔에 경고를 남기고 아무것도 무효화하지 않습니다.</li>
            <li><code>&apos;page&apos;</code>는 <code>/products/[id]/reviews</code> 같은 하위 페이지까지 넓히지 않습니다. 하위까지 포함하려면 <code>&apos;layout&apos;</code>을 씁니다(page vs layout 실습 참고).</li>
          </ul>
        </div>
        <div>
          <h5 className={H}>4. 실무 주의사항</h5>
          <ul className={LIST}>
            <li>무효화는 표시만 해 두고 실제 재계산은 각 경로의 다음 방문 때 일어납니다. 패턴 무효화가 수천 개 페이지를 한꺼번에 재렌더하지는 않습니다.</li>
            <li>상품 하나의 가격이 바뀌면 구체 경로, 상품 상세 템플릿 전체가 바뀌면 패턴 + <code>&apos;page&apos;</code>를 씁니다.</li>
            <li>상품 페이지에는 <code>generateStaticParams</code>를 두지 않고 <code>connection()</code> 뒤에서 렌더해, 빌드 시 프리렌더 값이 아니라 요청 시점의 캐시 엔트리만 비교되게 했습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
